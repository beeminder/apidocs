# URL-Based Goal Creation

Create Beeminder goals by passing parameters in the URL to pre-fill the goal creation wizard. This allows for streamlined goal setup from external applications, bookmarklets, or custom workflows.

## Overview

Instead of manually filling out the goal creation wizard, you can construct a URL with query parameters that automatically populate the form fields and advance to the preview screen.

**Base URL:** `https://www.beeminder.com/new`

**Note:** Users must be logged in to create goals. Unauthenticated requests will redirect to the login page.

## Quick Examples

### Do More Goal
Create a goal to do 5 pushups per day:
```
https://www.beeminder.com/new?goaltype=domore&units=pushups&dailyrate=5&goalname=pushups
```

### Weight Loss Goal
Create a weight loss goal starting at 200 lbs with 2 lb daily fluctuation:
```
https://www.beeminder.com/new?goaltype=weightloss&units=lbs&start_value=200&flux=2&goalname=getthinner
```

### Custom Goal with Safety Buffer
Create a reading goal with 7 days of initial safety buffer:
```
https://www.beeminder.com/new?goaltype=custom&units=pages&dailyrate=10&leeway=7&goalname=reading
```

## Parameters

### Required Parameters

#### `goaltype` (required)
The type of goal to create. Can use either user-friendly names or internal type names.

**User-friendly names:**
- `manual` - Show goal type picker
- `domore` - Do More goal (hustler)
- `doless` - Do Less goal (drinker)
- `weightloss` - Lose Weight goal (fatloser)
- `weightgain` - Gain Weight goal (gainer)
- `odometer` - Odometer goal (biker)
- `whittledown` - Whittle Down goal (inboxer)
- `custom` - Custom goal

**Internal type names (also accepted):**
- `hustler`, `drinker`, `biker`, `fatloser`, `gainer`, `inboxer`, `custom`

Or specify an integration:
- `fitbit`, `garmin`, `strava`, `github`, `gmail`, etc.

**Example:** `goaltype=domore`, or `goaltype=fitbit`

---

#### `units` (required for manual goals)
The units for measuring progress (e.g., "pushups", "pages", "hours").

**Rules:**
- Must start with a letter
- Maximum 30 characters
- Required for all manual goal types except when only specifying `goaltype=manual`

**Example:** `units=pushups`

---

#### `dailyrate` (required for some manual goals)
The daily rate of progress you're committing to. This is the number you need to achieve per day.

**Required for:** Do More, Do Less, Odometer, and Custom goals  
**Not required for:** Weight Loss, Weight Gain, and Whittle Down goals (these calculate the rate automatically)

**Example:** `dailyrate=5` (do 5 of your units per day)

---

#### `goalname` (required for auto-advance)
The URL slug for your goal. This becomes part of the goal URL: `beeminder.com/username/goalname`

**Rules:**
- Alphanumeric characters, dashes, and underscores only (no spaces)
- Maximum 20 characters
- Cannot be a reserved word (e.g., "new", "goal", "login", "archived")
- Must be unique among your goals

**Example:** `goalname=workout`

---

### Goal Type Specific Parameters

#### `start_value` (required for certain goal types)
The initial/current value for your goal.

**Required for:** 
- Odometer goals (current odometer reading)
- Weight Loss/Gain goals (current weight)
- Whittle Down goals (current count to whittle down)
- Custom goals (starting value)

**Example:** `start_value=200` (for a weight goal starting at 200 lbs)

---

#### `flux` (required for weight goals)
The expected daily weight fluctuation. Beeminder uses this to give you appropriate safety buffer for natural weight variations.

**Required for:** Weight Loss and Weight Gain goals  
**Invalid for:** All other goal types (will return error)

**Example:** `flux=2` (weight can fluctuate by 2 lbs per day)

---

### Optional Parameters

#### `leeway` (optional)
Number of days of initial safety buffer before you need to make progress.

**Default:** 0 (start immediately)  
**Maximum:** 30 days  
**Type:** Integer

**Example:** `leeway=7` (7 days before first deadline)

---

#### `pledge_cap` (optional)
The maximum pledge amount for this goal. When you derail, your pledge increases until it reaches this cap.

**Default:** User's default pledge cap  
**Allowed values:** 0, 5, 10, 30, 90, 270, 810, 2430, 7290  
**Type:** Integer (dollars)

**Example:** `pledge_cap=30` (cap pledge at $30)

---

#### `feetwetting` (optional)
Whether to hold the pledge at $0 for the first 7 days while you "get your feet wet" with the goal.

**Default:** `false`  
**Allowed values:** `true`, `false`  
**Type:** Boolean

**Example:** `feetwetting=true`

---

## Auto-Advance Behavior

When **all required parameters** for a goal type are provided, the wizard automatically advances through the form screens and stops at the **Preview** screen.

### Required Parameters by Goal Type

#### Do More / Do Less Goals
- `goaltype`
- `units`
- `dailyrate`
- `goalname`

#### Weight Loss / Weight Gain Goals
- `goaltype`
- `units`
- `start_value`
- `flux`
- `goalname`

#### Odometer / Custom Goals
- `goaltype`
- `units`
- `dailyrate`
- `start_value`
- `goalname`

#### Whittle Down Goals
- `goaltype`
- `units`
- `start_value`
- `goalname`

(Note: No `dailyrate` needed - Whittle Down goals automatically calculate the rate to reach zero)

### Partial Auto-Fill

If you provide some but not all required parameters, the forms will be pre-filled but won't auto-advance. The user can then manually fill in the missing fields and click Continue.

---

## Error Handling

Invalid parameters return a `400 Bad Request` response with JSON error details.

### Error Response Format
```json
{
  "error": "Goal name must contain only letters, numbers, dashes, and underscores (no spaces)",
  "errors": [
    "Goal name must contain only letters, numbers, dashes, and underscores (no spaces)"
  ]
}
```

### Common Validation Errors

#### Invalid Goal Name
```
https://www.beeminder.com/new?goaltype=domore&units=pages&dailyrate=5&goalname=my goal
```
**Error:** "Goal name must contain only letters, numbers, dashes, and underscores (no spaces)"

---

#### Goal Name Too Long
```
https://www.beeminder.com/new?goaltype=domore&units=pages&dailyrate=5&goalname=thisgoalnameiswaytoolongtobevalid
```
**Error:** "Goal name is too long (maximum 20 characters)"

---

#### Reserved Goal Name
```
https://www.beeminder.com/new?goaltype=domore&units=pages&dailyrate=5&goalname=new
```
**Error:** "Goal name 'new' is reserved and cannot be used"

---

#### Duplicate Goal Name
```
https://www.beeminder.com/new?goaltype=domore&units=pages&dailyrate=5&goalname=existinggoal
```
**Error:** "You already have a goal named 'existinggoal'"

---

#### Invalid Pledge Cap
```
https://www.beeminder.com/new?goaltype=domore&units=pages&dailyrate=5&goalname=test&pledge_cap=999
```
**Error:** "Pledge cap must be one of: 0, 5, 10, 30, 90, 270, 810, 2430, 7290"

---

#### Flux on Non-Weight Goal
```
https://www.beeminder.com/new?goaltype=domore&units=pages&dailyrate=5&goalname=test&flux=2
```
**Error:** "The 'flux' parameter is only valid for weight loss and weight gain goals"

---

## Complete Examples

### Example 1: Basic Do More Goal
Create a goal to write 500 words per day:
```
https://www.beeminder.com/new?goaltype=domore&units=words&dailyrate=500&goalname=writing
```

### Example 2: Do More Goal with Safety Buffer
Create a meditation goal with 3 days of leeway:
```
https://www.beeminder.com/new?goaltype=domore&units=sessions&dailyrate=1&leeway=3&goalname=meditate
```

### Example 3: Do More Goal with Pledge Cap
Create an exercise goal capped at $10:
```
https://www.beeminder.com/new?goaltype=domore&units=workouts&dailyrate=4&pledge_cap=10&goalname=exercise
```

### Example 4: Do Less Goal
Limit social media to 30 minutes per day:
```
https://www.beeminder.com/new?goaltype=doless&units=minutes&dailyrate=30&goalname=socialmedia
```

### Example 5: Weight Loss Goal
Lose weight starting from 180 lbs with 1.5 lb daily fluctuation:
```
https://www.beeminder.com/new?goaltype=weightloss&units=pounds&start_value=180&flux=1.5&goalname=weightloss
```

### Example 6: Odometer Goal
Track cumulative pages read, currently at page 0, reading 50 pages/day:
```
https://www.beeminder.com/new?goaltype=odometer&units=pages&dailyrate=50&start_value=0&goalname=bookpages
```

### Example 7: Whittle Down Goal
Reduce inbox from 200 emails at 5 emails per day:
```
https://www.beeminder.com/new?goaltype=whittledown&units=emails&dailyrate=5&start_value=200&goalname=inbox
```

### Example 8: Fee Twetting Goal
Create a goal with 7-day grace period at $0 pledge:
```
https://www.beeminder.com/new?goaltype=domore&units=tasks&dailyrate=3&feetwetting=true&goalname=tasks
```

### Example 9: Goal with All Optional Parameters
Create a fully customized goal:
```
https://www.beeminder.com/new?goaltype=domore&units=hours&dailyrate=2&leeway=7&pledge_cap=90&feetwetting=true&goalname=coding
```

---

## Integration Examples

### Bookmarklet
Create a bookmarklet to quickly create a goal for the current page:

```javascript
javascript:(function(){
  var title = document.title.substring(0,20).toLowerCase().replace(/[^a-z0-9]/g,'');
  var url = 'https://www.beeminder.com/new?goaltype=domore&units=items&dailyrate=1&goalname=' + title;
  window.open(url);
})();
```

### From External App
If you're building an app that helps users create Beeminder goals:

```python
import urllib.parse

def create_goal_url(goaltype, units, dailyrate, goalname, **kwargs):
    params = {
        'goaltype': goaltype,
        'units': units,
        'dailyrate': dailyrate,
        'goalname': goalname,
        **kwargs
    }
    query_string = urllib.parse.urlencode(params)
    return f"https://www.beeminder.com/new?{query_string}"

# Example usage
url = create_goal_url(
    goaltype='domore',
    units='pages',
    dailyrate=10,
    goalname='reading',
    leeway=7,
    pledge_cap=30
)
print(url)
```

### Browser Extension
```javascript
// Create a goal from a browser extension
function createBeeminderGoal(params) {
  const queryString = new URLSearchParams(params).toString();
  const url = `https://www.beeminder.com/new?${queryString}`;
  chrome.tabs.create({ url: url });
}

// Usage
createBeeminderGoal({
  goaltype: 'domore',
  units: 'articles',
  dailyrate: 2,
  goalname: 'reading',
  leeway: 3
});
```

---

## Notes

- Users must be logged in to access the goal creation page
- All parameters are case-sensitive
- Goal names are converted to lowercase automatically
- The preview screen allows final review before creating the goal
- Invalid parameter combinations return descriptive JSON errors
- Integration types (fitbit, garmin, etc.) redirect to their respective setup pages

---

## See Also

- [Beeminder API Documentation](https://api.beeminder.com)
- [Goal Creation API Endpoint](https://api.beeminder.com/#post-goals) - For programmatic goal creation
- [Goal Types Reference](https://help.beeminder.com/article/11-goal-types)
