# Part 2 – Backend (PHP / Laravel)

## Q1: Database Operations

To insert a new record into the votes table, I used Laravel’s Eloquent create method on the Vote model.

### Code

```php
Vote::create([
    'voter_id'    => 5,
    'survey_id'   => 7,
    'question_id' => 6,
    'vote_date'   => now(),
    'score'       => 4,
    'comment'     => 'Good experience overall'
]);
```

## Q2: Write a query using the Vote model to retrieve all scores for survey_id 7 where the voter_id is 5.

To solve this, I used Laravel’s Eloquent query builder to filter records from the votes table.

### Code

```php
$scores = Vote::where('survey_id', 7)
    ->where('voter_id', 5)->get();
```

## Q3: Transforming a collection into a key/value array

### Approach

For this question, I used Laravel's `mapWithKeys` method to transform the collection of scores into a key/value array where the key is the `question_id` and the value is the `score`.

### Code

```php
$scoresArray = $scores->mapWithKeys(function ($item) {
    return [$item['question_id'] => $item['score']];
})->all();

```

## Q4: Logic & Authorisation

### Approach

I used Laravel’s `Auth` facade to check the role of the currently authenticated user.

- If the user has the `admin` role, they are redirected to the `/admin` route.
- Otherwise, they are redirected to `/dashboard` and a flash error message is set in the session.

### Code

```php

$user = Auth::user();

if($user->hasRole('admin')) {
    return redirect('/admin');
} else {
    $request->session()->flash('error', 'You do not have admin access.');
    return redirect('/dashboard');
}
```

## Q5: API Integration

### Approach

For this task, I retrieved the survey data from the API and extracted the `survey` object along with its `questions` array. Each question has child questions, so I used nested loops in the Blade view to display all child questions in a table.

The table has three columns:

- **Question** – the question text (`display_text`)
- **Average** – the average score for that question
- **% vs Survey Avg** – the percentage difference between the question’s average and the overall survey average, with conditional coloring for positive or negative differences.

### Code

```php
$response = Http:get('https://demo.the-happiness-index.com/api.json/surveys/126/overview/', [
'api_id' => 391121,
'api_key' => 'demoAPIdemo'
]);

$data = $response->json();
$survey = $data['survey'];
$questions = $data['survey']['questions'];

return view('survey.overview', ['survey' => $survey, 'questions' => $questions]);
```

Blade View

```php
<table class="min-w-full border border-gray-300 text-center">
    <caption>Survey Results</caption>
    <thead class="bg-gray-500">
        <tr>
            <th scope="col">Question</th>
            <th scope="col">Average</th>
            <th scope="col">% vs Survey Avg</th>
        </tr>
    </thead>
    <tbody>
        @foreach($questions as $question)
            @foreach($question['children'] as $child)
                <tr>
                    <td>{{ $child['display_text'] }}</td>
                    <td>{{ $child['average'] }}</td>
                    <td>
                        @if($child['average'] > $survey['average'])
                            <span class="text-green-500">+{{ (($child['average'] - $survey['average']) / $survey['average']) * 100 }}</span>
                        @else
                            <span class="text-red-500">-{{ (($child['average'] - $survey['average']) / $survey['average']) * 100  }}</span>
                        @endif
                    </td>
                </tr>
            @endforeach
        @endforeach
    </tbody>
</table>

```
