<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- PWA Web App Manifest -->
    <link rel="manifest" href="{{ asset('manifest.json') }}" />

    <!-- Mobile / iOS Safari Meta Tags -->
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="EaseRes" />
    <link rel="apple-touch-icon" href="{{ asset('images/logo.png') }}" />

    <!-- Inertia & Vite Assets -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/app/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia

    <script>
        // 1. Register Service Worker (Required for automatic browser install prompt)
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register("{{ asset('sw.js') }}")
                    .then(reg => console.log('Service Worker Registered Successfully'))
                    .catch(err => console.error('Service Worker Registration Failed:', err));
            });
        }

        // 2. Automatic Install Suggestion Log
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('Browser installability criteria met. Native banner will show automatically.');
            // DO NOT call e.preventDefault() here if you want the native browser banner to handle itself automatically.
        });
    </script>
</body>

</html>