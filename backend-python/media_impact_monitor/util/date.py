from datetime import date


def verify_dates(start_date: date, end_date: date):
    assert start_date <= date.today(), "Start date must be in the past."
    assert start_date <= end_date, "Start date must be before end date."
    assert end_date <= date.today(), "End date must be in the past."
    return True
