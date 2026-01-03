<?php
/**
 * Rate Limiter for Login Protection
 * 
 * Simple file-based rate limiting for brute force protection.
 * Limits login attempts per IP + email combination.
 */

class RateLimiter
{
    private string $storage_dir;
    private int $max_attempts;
    private int $lockout_seconds;

    public function __construct(int $max_attempts = 5, int $lockout_seconds = 900)
    {
        $this->storage_dir = __DIR__ . '/../../storage/rate_limits';
        $this->max_attempts = $max_attempts;
        $this->lockout_seconds = $lockout_seconds;

        if (!is_dir($this->storage_dir)) {
            mkdir($this->storage_dir, 0755, true);
        }
    }

    /**
     * Check if action is rate limited
     * @param string $key Unique identifier (e.g., "login:email:ip")
     * @return array ['allowed' => bool, 'remaining' => int, 'retry_after' => int|null]
     */
    public function check(string $key): array
    {
        $hash = md5($key);
        $file = $this->storage_dir . '/' . $hash . '.json';

        $data = $this->loadData($file);
        $now = time();

        // Clean old attempts (outside window)
        $data['attempts'] = array_filter($data['attempts'], function ($timestamp) use ($now) {
            return ($now - $timestamp) < $this->lockout_seconds;
        });

        $attempt_count = count($data['attempts']);

        if ($attempt_count >= $this->max_attempts) {
            $oldest = min($data['attempts']);
            $retry_after = $this->lockout_seconds - ($now - $oldest);
            return [
                'allowed' => false,
                'remaining' => 0,
                'retry_after' => max(0, $retry_after)
            ];
        }

        return [
            'allowed' => true,
            'remaining' => $this->max_attempts - $attempt_count,
            'retry_after' => null
        ];
    }

    /**
     * Record an attempt
     */
    public function hit(string $key): void
    {
        $hash = md5($key);
        $file = $this->storage_dir . '/' . $hash . '.json';

        $data = $this->loadData($file);
        $data['attempts'][] = time();

        // Keep only recent attempts
        $now = time();
        $data['attempts'] = array_filter($data['attempts'], function ($timestamp) use ($now) {
            return ($now - $timestamp) < $this->lockout_seconds;
        });

        file_put_contents($file, json_encode($data), LOCK_EX);
    }

    /**
     * Clear rate limit for a key (e.g., after successful login)
     */
    public function clear(string $key): void
    {
        $hash = md5($key);
        $file = $this->storage_dir . '/' . $hash . '.json';

        if (file_exists($file)) {
            unlink($file);
        }
    }

    private function loadData(string $file): array
    {
        if (file_exists($file)) {
            $content = file_get_contents($file);
            $data = json_decode($content, true);
            if (is_array($data) && isset($data['attempts'])) {
                return $data;
            }
        }
        return ['attempts' => []];
    }
}

/**
 * Helper function for rate limiting login attempts
 */
function check_login_rate_limit(string $email, string $ip): array
{
    $limiter = new RateLimiter(5, 900); // 5 attempts per 15 minutes
    $key = "login:{$email}:{$ip}";
    return $limiter->check($key);
}

function record_login_attempt(string $email, string $ip): void
{
    $limiter = new RateLimiter(5, 900);
    $key = "login:{$email}:{$ip}";
    $limiter->hit($key);
}

function clear_login_attempts(string $email, string $ip): void
{
    $limiter = new RateLimiter(5, 900);
    $key = "login:{$email}:{$ip}";
    $limiter->clear($key);
}
