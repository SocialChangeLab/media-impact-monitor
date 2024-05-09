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
        html.P("Select the organizers you want to compare:"),
        dash_treeview_antd.TreeView(
            id="organizer-selector",
            multiple=False,
            checkable=True,
            checked=[],
            selected=[],
            # expanded=["0"],
            data={
                "title": "climate change",
                "key": "0",
                "children": [
                    {"title": "Fridays for Future", "key": "Fridays for Future"},
                    {"title": "Extinction Rebellion", "key": "Extinction Rebellion"},
                    {
                        "title": "Last Generation (Germany)",
                        "key": "Last Generation (Germany)",
                    },
                ],
            },
        ),
        # Optionally, you can pass options to the Vega component.
        # See https://github.com/vega/vega-embed#options for more details.
        dvc.Vega(id="altair-chart", opt={"renderer": "svg", "actions": False}),
    ]
)


@callback(Output("altair-chart", "spec"), Input("organizer-selector", "checked"))
def display_altair_chart(checked):
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

    chart = (
        alt.Chart(df)
        .mark_circle()
        .encode(
            x="date:T",  # T: temporal
            y="y:Q",  # Q: quantitative
            color="organizer:N",  # N: nominal
            size="participants:Q",  # Quantitative size encoding
        )
        .properties(width=600, height=300)
    )

    return chart.to_dict()


if __name__ == "__main__":
    app.run(debug=True)
