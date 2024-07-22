from media_impact_monitor.trends.keyword_trend import topic_queries


def test_topic_queries():
    for media_source in ["news_online", "news_print"]:
        queries = topic_queries(media_source)
        assert queries["climate science"].startswith(
            'klimaforsch* OR klimawissenschaft*'
        )
        assert queries["climate policy"].startswith(
            "klimapoliti* OR klimaneutral* OR klimaziel*"
        )
        assert '"erneuerbare energie*"' in queries["climate policy"]
    queries = topic_queries("web_google")
    assert "+erderwärmung" in queries["climate science"]
    # assert "-\\*protest*" in queries["all_excl_activism"]
    # assert "+klimawandel" in queries["all_excl_activism"]
