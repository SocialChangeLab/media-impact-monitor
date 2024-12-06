from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport
import os
from dotenv import load_dotenv
import pandas as pd
import matplotlib.pyplot as plt
from joblib import Memory
from tqdm.auto import tqdm
import time
import re

# Setup caching
memory = Memory(".cache", verbose=0)
cache = memory.cache
wait_time = 1

load_dotenv()
transport = RequestsHTTPTransport(
    url="https://api.opencollective.com/graphql/v2",
    headers={"Personal-Token": os.getenv("OPENCOLLECTIVE_API_TOKEN")},
)
client = Client(transport=transport, fetch_schema_from_transport=True)


@cache(ignore=["wait_time"])
def fetch(query, variable_values, wait_time=0.1, **kwargs):
    time.sleep(wait_time)
    return client.execute(query, variable_values=variable_values, **kwargs)


def fetch_climate_orgs(limit=1000):
    # Define search terms
    search_terms = [
        "climate",
        "for future",
        "extinction rebellion",
        "xr",
        "fossil",
        "oil",
    ]

    query = gql("""
    query GetAccounts($limit: Int, $offset: Int, $searchTerm: String) {
        accounts(
            limit: $limit
            offset: $offset
            isActive: true
            searchTerm: $searchTerm
            type: COLLECTIVE
        ) {
            nodes {
                slug
                name
                legalName
                description
                longDescription
                tags
                location {
                    name
                    address
                    country
                }
                stats {
                    totalAmountReceived {
                        value
                        currency
                        valueInCents
                    }
                    totalAmountReceivedTimeSeries {
                        dateFrom
                        dateTo
                        timeUnit
                        nodes {
                            date
                            amount {
                                value
                                currency
                                valueInCents
                            }
                            label
                        }
                    }
                }
            }
        }
    }
    """)

    all_orgs = []
    seen_slugs = set()  # To prevent duplicates

    # Fetch orgs for each search term
    for term in search_terms:
        response = fetch(
            query, variable_values={"limit": limit, "offset": 0, "searchTerm": term}
        )

        # Add only unique organizations
        for org in response["accounts"]["nodes"]:
            if org["slug"] not in seen_slugs:
                all_orgs.append(org)
                seen_slugs.add(org["slug"])

    print(f"Found {len(all_orgs)} unique organizations")
    return all_orgs


# Fetch transactions for an organization with pagination
@cache
def fetch_transactions(org_slug, total_limit=100_000, page_size=1000):
    query = gql("""
    query GetAccountTransactions(
        $account: [AccountReferenceInput!]
        $limit: Int!
        $offset: Int!
        $orderBy: ChronologicalOrderInput!
    ) {
        transactions(
            account: $account
            limit: $limit
            offset: $offset
            orderBy: $orderBy
        ) {
            nodes {
                id
                createdAt
                type
                amount {
                    value
                    currency
                }
            }
            totalCount
        }
    }
    """)

    all_transactions = []
    offset = 0
    while offset < total_limit:
        variables = {
            "account": [{"slug": org_slug}],
            "limit": min(page_size, total_limit - offset),
            "offset": offset,
            "orderBy": {"field": "CREATED_AT", "direction": "DESC"},
        }

        response = fetch(query, variables, wait_time)
        transactions = response["transactions"]["nodes"]
        total_count = response["transactions"]["totalCount"]

        all_transactions.extend(transactions)

        # Break if we've fetched all available transactions
        if len(transactions) < page_size or offset + page_size >= total_count:
            break

        offset += page_size
    print(f"Fetched {len(all_transactions)} transactions for {org_slug}")
    return all_transactions

def get_transactions_df(orgs):
    all_transactions = []
    for org in tqdm(orgs):
        transactions = fetch_transactions(org["slug"])
        if transactions:
            # Convert to DataFrame with just date and amount
            df = pd.DataFrame(
                [
                    {
                        "date": pd.to_datetime(t["createdAt"]).floor("D"),  # Floor to day
                        "amount": float(t["amount"]["value"]) if "amount" in t else 0,
                    }
                    for t in transactions
                ]
            )
            if not df.empty:
                df["organization"] = org["name"]
                all_transactions.append(df)
    if not all_transactions:
        return None
    return pd.concat(all_transactions)

def generalize_group_name(name):
    if re.search(r"xr|extinction.?rebellion|scientist.?rebellion", name.lower()):
        return "Extinction Rebellion"
    elif re.search(r"(4|for).?future|fff|klimatreik", name.lower()):
        return "Fridays For Future"
    elif re.search(r"fossil.?free", name.lower()):
        return "Fossil Free"
    else:
        return name

def group_by_wealth(df, top_n=10):
    # Calculate total donations per organization
    total_by_org = df.groupby("organization")["amount"].sum().sort_values(ascending=False)
    # Get top N organizations
    top_orgs = set(total_by_org.head(top_n).index)
    # Create a mapping function
    def map_org(org):
        return org if org in top_orgs else "Other"
    return df.assign(organization=df["organization"].apply(map_org))

def get_monthly_dfs(df, pivot=False):
    monthly = (
        df.set_index("date")
        .groupby(["organization", pd.Grouper(freq="W")])["amount"]
        .sum()
        .reset_index()
    )

    # Create separate positive and negative DataFrames
    positive_df = monthly[monthly["amount"] > 0].copy()
    negative_df = monthly[monthly["amount"] < 0].copy()

    if pivot:
        # Pivot to get organizations as columns
        positive_pivot = positive_df.pivot(
            index="date", columns="organization", values="amount"
        ).fillna(0)
        negative_pivot = negative_df.pivot(
            index="date", columns="organization", values="amount"
        ).fillna(0)
        return positive_pivot, negative_pivot
    else:
        return positive_df, negative_df