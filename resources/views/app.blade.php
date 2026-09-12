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
        let deferredPrompt;

        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register("{{ asset('sw.js') }}");
            });
        }

        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent default quiet handling
            e.preventDefault();
            // Stash the event so it can be triggered by a button click
            deferredPrompt = e;

            // Show a custom floating install banner on the web app
            const banner = document.getElementById('custom-install-banner');
            if (banner) {
                banner.style.display = 'flex';
            }
        });

        function triggerPWAInstall() {
            if (!deferredPrompt) return;

            // Show the native browser install dialog
            deferredPrompt.prompt();

            deferredPrompt.userChoice.then((choice) => {
                if (choice.outcome === 'accepted') {
                    document.getElementById('custom-install-banner').style.display = 'none';
                }
                deferredPrompt = null;
            });
        }
    </script>

    <!-- Floating Install Notification Bar -->
    <div id="custom-install-banner" style="display: none;" class="fixed bottom-6 right-6 left-6 sm:left-auto bg-[var(--pitch,#0f172a)] text-white p-4 rounded-2xl shadow-2xl z-50 flex items-center justify-between gap-4 max-w-md border border-gray-700">
        <div>
            <h4 className="font-bold text-sm">Install App</h4>
        </div>
        <button onclick="triggerPWAInstall()" class="px-4 py-2 bg-[var(--amber,#f59e0b)] hover:bg-amber-600 text-white text-xs font-bold rounded-xl whitespace-nowrap shadow">
            Install Now
        </button>
    </div>
</body>

</html>