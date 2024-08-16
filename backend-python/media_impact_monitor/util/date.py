from datetime import date, timedelta

from pydantic import BaseModel


def verify_dates(start_date: date, end_date: date):
    assert start_date is not None, "Start date must be set."
    assert end_date is not None, "End date must be set."
    assert start_date <= date.today(), "Start date must be in the past or today."
    assert start_date <= end_date, "Start date must be before or equal to end date."
    assert end_date <= date.today(), "End date must be in the past or today."
    return True


def get_latest_data(func: callable, kwargs: dict):
    """
    Takes a function and a query object (as defined in types.py) that has an `end_date` field.
    If the end date field is not set, it will be set to yesterday.
    If it is not possible to fetch data for the given end date, the function will try to fetch data for the previous day.
    """
    assert "end_date" in kwargs
    end_date = date.today() - timedelta(days=1)
    _stop_date = date.today() - timedelta(days=2)
    exception = None  # store exception to raise it only once in the end
    while end_date >= _stop_date:
        try:
            kwargs["end_date"] = end_date
            data = func(**kwargs)
            return data
        except Exception as e:
            print(f"Failed to fetch data for {end_date}: {e}")
            end_date -= timedelta(days=1)
            exception = e
    else:
        raise Exception(
            f"Failed to fetch data for dates between {_stop_date} and {end_date}: {exception}"
        )
