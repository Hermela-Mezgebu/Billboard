<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('owner_id');
            $table->text('message');
            $table->string('type')->nullable();
            $table->boolean('is_read')->default(false); // ✅ IMPORTANT
            $table->timestamps();

            // optional (recommended)
            $table->foreign('owner_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
