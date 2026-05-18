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
    Schema::create('billboards', function (Blueprint $table) {
        $table->id();

        $table->foreignId('owner_id')
            ->constrained('users')
            ->cascadeOnDelete();

        // ✅ BASIC INFO
        $table->string('title');
        $table->string('location');
        $table->text('description')->nullable();

        // ✅ MEDIA
        $table->string('image')->nullable();

        // ✅ SPECS
        $table->string('screen_size')->nullable();
        $table->string('duration')->nullable();

        // ✅ PRICE
        $table->decimal('price', 10, 2)->nullable();

        // ✅ TYPE
        $table->string('type')->nullable(); // digital / static

        // ✅ STATUS SYSTEM (VERY IMPORTANT)
        $table->string('status')->default('pending');

        // ✅ REJECTION REASON
        $table->text('rejection_reason')->nullable();

        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('billboards');
    }
};
