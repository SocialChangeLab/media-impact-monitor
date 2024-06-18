from media_impact_monitor.trends.keyword_trend import topic_queries


def test_topic_queries():
    for media_source in ["news_online", "news_print"]:
        queries = topic_queries(media_source)
        assert queries["science"].startswith(
            "klimawandel OR klimaerwärmung OR erderwärmung"
        )
        assert queries["policy"].startswith(
            "klimaneutral* OR klimaziel* OR klimaschutzpaket"
        )
        assert '"erneuerbare energie*"' in queries["policy"]
    queries = topic_queries("web_google")
    assert "-\\*protest*" in queries["all_excl_activism"]
    assert "+klimawandel" in queries["all_excl_activism"]
