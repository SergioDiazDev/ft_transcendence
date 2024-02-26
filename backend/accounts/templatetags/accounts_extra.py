from django import template
from datetime import timedelta, datetime, timezone

register = template.Library()

@register.filter
def isOnline(value):
	now_utc = datetime.now(timezone.utc)
	one_hour_ago_utc = now_utc - timedelta(seconds=10)

	if isinstance(value, datetime):
		value = value.replace(tzinfo=timezone.utc)

		if value > one_hour_ago_utc:
			return True
	return False
