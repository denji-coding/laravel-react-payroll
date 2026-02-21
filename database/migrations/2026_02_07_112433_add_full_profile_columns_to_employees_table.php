<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->string('middle_name')->nullable()->after('last_name');
            $table->string('email')->nullable()->after('middle_name');
            $table->string('phone')->nullable()->after('email');
            $table->date('date_of_birth')->nullable()->after('phone');
            $table->string('gender')->nullable()->after('date_of_birth');
            $table->string('civil_status')->nullable()->after('gender');
            $table->text('address')->nullable()->after('civil_status');
            $table->date('date_hired')->nullable()->after('branch_id');
            $table->decimal('basic_salary', 12, 2)->nullable()->after('date_hired');
            $table->string('rfid')->nullable()->after('basic_salary');
            $table->string('sss')->nullable()->after('status');
            $table->string('philhealth')->nullable()->after('sss');
            $table->string('pagibig')->nullable()->after('philhealth');
            $table->string('tin')->nullable()->after('pagibig');
            $table->string('bank_name')->nullable()->after('tin');
            $table->string('bank_account')->nullable()->after('bank_name');
            $table->string('emergency_contact_name')->nullable()->after('bank_account');
            $table->string('emergency_contact_phone')->nullable()->after('emergency_contact_name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropColumn([
                'middle_name', 'email', 'phone', 'date_of_birth', 'gender', 'civil_status',
                'address', 'date_hired', 'basic_salary', 'rfid', 'sss', 'philhealth', 'pagibig',
                'tin', 'bank_name', 'bank_account', 'emergency_contact_name', 'emergency_contact_phone',
            ]);
        });
    }
};
