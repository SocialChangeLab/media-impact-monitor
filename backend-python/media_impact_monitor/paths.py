"""Define important local and remote paths to avoid problems with absolute and relative paths."""

from pathlib import Path

from cloudpathlib import CloudPath

src = Path(__file__).parent.parent
src = src.parent
cache = src / ".cache"
data = CloudPath("gs://protest-impact-policy")
