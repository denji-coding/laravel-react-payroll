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
        Schema::table('leaves', function (Blueprint $table) {
            $table->foreignId('employee_id')->after('id')->constrained()->cascadeOnDelete();
            $table->string('leave_type')->after('employee_id');
            $table->date('start_date')->after('leave_type');
            $table->date('end_date')->after('start_date');
            $table->string('status')->default('pending')->after('end_date');
            $table->text('reason')->nullable()->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('leaves', function (Blueprint $table) {
            $table->dropForeign(['employee_id']);
            $table->dropColumn(['leave_type', 'start_date', 'end_date', 'status', 'reason']);
        });
    }
};
