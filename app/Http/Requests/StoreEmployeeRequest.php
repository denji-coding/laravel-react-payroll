<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $merge = [];
        $optional = [
            'middle_name', 'email', 'phone', 'date_of_birth', 'gender', 'civil_status',
            'address', 'position_id', 'branch_id', 'date_hired', 'basic_salary', 'rfid',
            'sss', 'philhealth', 'pagibig', 'tin', 'bank_name', 'bank_account',
            'emergency_contact_name', 'emergency_contact_phone',
        ];
        foreach ($optional as $key) {
            if ($this->has($key) && $this->input($key) === '') {
                $merge[$key] = null;
            }
        }
        if ($merge !== []) {
            $this->merge($merge);
        }
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'employee_id' => ['required', 'string', 'max:255', 'unique:employees,employee_id'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'string', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'date_of_birth' => ['nullable', 'date'],
            'gender' => ['nullable', 'string', 'in:male,female,other'],
            'civil_status' => ['nullable', 'string', 'in:single,married,widowed,separated'],
            'address' => ['nullable', 'string', 'max:1000'],
            'position_id' => ['nullable', 'exists:positions,id'],
            'branch_id' => ['nullable', 'exists:branches,id'],
            'date_hired' => ['nullable', 'date'],
            'basic_salary' => ['nullable', 'numeric', 'min:0'],
            'rfid' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'string', 'in:active,inactive,deleted'],
            'photo' => ['nullable', 'image', 'max:2048', 'mimes:jpg,jpeg,png,webp'],
            'sss' => ['nullable', 'string', 'max:50'],
            'philhealth' => ['nullable', 'string', 'max:50'],
            'pagibig' => ['nullable', 'string', 'max:50'],
            'tin' => ['nullable', 'string', 'max:50'],
            'bank_name' => ['nullable', 'string', 'max:255'],
            'bank_account' => ['nullable', 'string', 'max:100'],
            'emergency_contact_name' => ['nullable', 'string', 'max:255'],
            'emergency_contact_phone' => ['nullable', 'string', 'max:50'],
        ];
    }
}
