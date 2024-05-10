import altair as alt
import dash_bootstrap_components as dbc
import dash_treeview_antd
import dash_vega_components as dvc
import numpy as np
import pandas as pd
import requests
from dash import Dash, Input, Output, callback, dcc, html

app = Dash(__name__)

app.layout = html.Div(
    [
        html.H1("Media Impact Monitor"),
        html.P("Organizers:"),
        dash_treeview_antd.TreeView(
            id="organizer-selector",
            multiple=True,
            checkable=True,
            checked=[
                "Fridays for Future",
                "Extinction Rebellion",
                "Last Generation (Germany)",
            ],
            expanded=[],
            data={
                "title": "Select protest organizers",
                "key": "0",
                "children": [
                    {
                        "title": "climate change",
                        "key": "0-0",
                        "children": [
                            {
                                "title": "Fridays for Future",
                                "key": "Fridays for Future",
                            },
                            {
                                "title": "Extinction Rebellion",
                                "key": "Extinction Rebellion",
                            },
                            {
                                "title": "Last Generation (Germany)",
                                "key": "Last Generation (Germany)",
                            },
                        ],
                    },
                    {
                        "title": "animal rights",
                        "key": "0-1",
                        "children": [
                            {
                                "title": "Animal Rising",
                                "key": "Animal Rising",
                            }
                        ],
                    },
                ],
            },
        ),
        # Optionally, you can pass options to the Vega component.
        # See https://github.com/vega/vega-embed#options for more details.
        dvc.Vega(
            id="protest-chart",
            opt={"renderer": "svg", "actions": False},
            signalsToObserve=["selected"],
        ),
        html.Div(
            id="detail-text",
            style={"padding": "20px", "margin-top": "20px", "max-width": "700px"},
        ),
        dvc.Vega(id="media-chart", opt={"renderer": "svg", "actions": False}),
    ]
)


def shorten_text(text, length=200):
    if len(text) > length:
        return text[:length] + "..."
    return text


@callback(Output("protest-chart", "spec"), Input("organizer-selector", "checked"))
def display_protest_chart(checked):
    organizers = [a for a in checked if not a[0] == "0"]
    if not organizers:
        return None
    res = requests.post(
        # "https://api.dev.mediaimpactmonitor.app/events",
        "http://localhost:8000/events",
        json={
            "event_type": "protest",
            "source": "acled",
            "topic": "climate_change",
            "start_date": "2023-07-01",
            "end_date": "2023-12-31",
            "organizers": organizers,
        },
    )
    events = res.json()["data"]

    df = pd.DataFrame(events)
    df["organizer"] = df["organizers"].apply(
        lambda x: ([a for a in x if a in organizers] or ["other"])[0]
    )
    df["y"] = np.random.normal(loc=0, scale=1, size=len(df))
    df["participants"] = np.random.randint(100, 1000, size=len(df))
    df["description_short"] = df["description"].apply(shorten_text)
    selection = alt.selection_point(fields=["description"], name="selected")

    chart = (
        alt.Chart(df)
        .mark_circle()
        .encode(
            x="date:T",  # T: temporal
            y="y:Q",  # Q: quantitative
            color="organizer:N",  # N: nominal
            size="participants:Q",  # Quantitative size encoding
            tooltip=[
                alt.Tooltip("date:T", title="Date"),
                alt.Tooltip("organizer:N", title="Organizer"),
                alt.Tooltip("participants:Q", title="Participants"),
                alt.Tooltip("description_short:N", title="Description"),
            ],
        )
        .add_selection(selection)
        .properties(width=600, height=300)
    )

    return chart.to_dict()


@callback(Output("detail-text", "children"), Input("protest-chart", "signalData"))
def handle_click(signalData):
    if signalData and "selected" in signalData:
        description = signalData["selected"].get("description", "")
        return description
    return ""


@callback(Output("media-chart", "spec"), Input("organizer-selector", "checked"))
def display_media_chart(media_source):
    res = requests.post(
        # "https://api.dev.mediaimpactmonitor.app/trend",
        "http://localhost:8000/trend",
        json={
            "trend_type": "keywords",
            "media_source": "news_online",
            "topic": "climate_change",
            "query": '"Letzte Generation"',
            "start_date": "2023-01-01",
            "end_date": "2023-12-31",
        },
    )
    data = res.json()["data"]
    df = pd.DataFrame(list(data.items()), columns=["date", "value"])
    df["date"] = pd.to_datetime(df["date"])
    chart = (
        alt.Chart(df)
        .mark_line(point=True)
        .encode(
            x="date:T",  # T: temporal
            y="value:Q",  # Q: quantitative
            tooltip=["date", "value"],
        )
        .properties(width=600, height=300)
    )
    return chart.to_dict()


if __name__ == "__main__":
    app.run(debug=True)
