"""Main module for media_impact_monitor package.
Re-export important modules and functions.
"""

from beartype.claw import beartype_this_package


from media_impact_monitor.util.paths import data, src

beartype_this_package()
