<?php
// NIPT Auth Helper - Stub
// This file provides authentication helper functions for the NIPT module

function nipt_generate_password_hash($password)
{
    return password_hash($password, PASSWORD_DEFAULT);
}

function nipt_verify_password($password, $hash)
{
    return password_verify($password, $hash);
}

function nipt_generate_token($length = 32)
{
    return bin2hex(random_bytes($length));
}
