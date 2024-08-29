from media_impact_monitor.util.paths import src


def test_src_path():
    assert src.exists(), "The 'src' path should exist."
    assert src.is_dir(), "The 'src' path should be a directory."
    assert any(src.iterdir()), "The 'src' directory should not be empty."
