<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTimeScheduleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'employee_id' => [
                'required',
                'integer',
                'exists:employees,id',
                Rule::unique('time_schedules', 'employee_id'),
            ],
            'days' => ['required', 'array', 'size:7'],
            'days.*.day' => ['required', 'string', 'in:Mon,Tue,Wed,Thu,Fri,Sat,Sun'],
            'days.*.duty' => ['required', 'boolean'],
            'days.*.am_in' => ['required', 'string', 'date_format:H:i'],
            'days.*.am_out' => ['required', 'string', 'date_format:H:i'],
            'days.*.pm_in' => ['required', 'string', 'date_format:H:i'],
            'days.*.pm_out' => ['required', 'string', 'date_format:H:i'],
        ];
    }
}
