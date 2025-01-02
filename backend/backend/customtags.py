from django import template
import warnings

register = template.Library()

@register.filter(is_safe=False)
def length_is(value, arg):
    """Return a boolean of whether the value's length is the argument."""
    warnings.warn(
        "The length_is template filter is deprecated in favor of the length template "
        "filter and the == operator within an {% if %} tag.",
        DeprecationWarning,  # Use a more general warning class
    )
    try:
        return len(value) == int(arg)
    except (ValueError, TypeError):
        return False