from datetime import date


def verify_dates(start_date: date, end_date: date):
    assert start_date <= date.today(), "Start date must be in the past or today."
    assert start_date <= end_date, "Start date must be before or equal to end date."
    assert end_date <= date.today(), "End date must be in the past or today."
    return True
