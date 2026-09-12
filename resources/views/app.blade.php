<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- Web App Manifest -->
    <link rel="manifest" href="{{ asset('manifest.json') }}" />

    <!-- iOS Safari Metadata -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="VenueBook" />
    <link rel="apple-touch-icon" href="{{ asset('images/icon-192.png') }}" />

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/app/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia

    <script>
        // 1. Register Service Worker
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register("{{ asset('sw.js') }}")
                    .then(reg => console.log('Service Worker Active'))
                    .catch(err => console.error('SW Error:', err));
            });
        }

        // 2. Automatically prompt user when install criteria are met
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent default mini-infobar on mobile Chrome
            e.preventDefault();

            // Trigger native prompt immediately
            e.prompt();

            e.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the shortcut prompt');
                } else {
                    console.log('User dismissed the prompt');
                }
            });
        });
    </script>
</body>

</html>