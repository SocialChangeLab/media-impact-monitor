from datetime import date, timedelta


def verify_dates(start_date: date, end_date: date):
    assert start_date <= date.today(), "Start date must be in the past or today."
    assert start_date <= end_date, "Start date must be before or equal to end date."
    assert end_date <= date.today(), "End date must be in the past or today."
    return True


def get_latest_data(func: callable):
    _date = date.today() - timedelta(days=1)
    _stop_date = _date - timedelta(days=14)
    exception = None
    while _date >= _stop_date:
        try:
            data = func(request_date=_date)
            return data
        except Exception as e:
            print(f"Failed to fetch data for {_date}: {e}")
            _date -= timedelta(days=1)
            exception = e
    else:
        raise exception
