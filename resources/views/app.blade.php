<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>


    <!-- Mobile / iOS Safari Meta Tags -->
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="EaseRes" />
    <link rel="apple-touch-icon" href="{{ url('/images/logo.png') }}" />
    <link rel="manifest" href="data:application/manifest+json;base64,ewogICJuYW1lIjogIkVhc2UgUmVzZXJ2YXRpb24iLAogICJzaG9ydF9uYW1lIjogIkVhc2VSZXMiLAogICJzdGFydF91cmwiOiAiLyIsCiAgInNjb3BlIjogIi8iLAogICJpZCI6ICIvIiwKICAiYmFja2dyb3VuZF9jb2xvciI6ICIjZmZmZmZmIiwKICAidGhlbWVfY29sb3IiOiAiIzBmMTcyYSIsCiAgImRpc3BsYXkiOiAic3RhbmRhbG9uZSIsCiAgIm9yaWVudGF0aW9uIjogInBvcnRyYWl0IiwKICAiaWNvbnMiOiBbCiAgICB7CiAgICAgICJzcmMiOiAiL2ltYWdlcy9sb2dvLnBuZyIsCiAgICAgICJzaXplcyI6ICIxOTJ4MTkyIiwKICAgICAgInR5cGUiOiAiaW1hZ2UvcG5nIiwKICAgICAgInB1cnBvc2UiOiAiYW55IG1hc2thYmxlIgogICAgfSwKICAgIHsKICAgICAgInNyYyI6ICIvaW1hZ2VzL2xvZ28ucG5nIiwKICAgICAgInNpemVzIjogIjUxMng1MTIiLAogICAgICAidHlwZSI6ICJpbWFnZS9wbmciLAogICAgICAicHVycG9zZSI6ICJhbnkgbWFza2FibGUiCiAgICB9CiAgXQp9" />
    <!-- Inertia & Vite Assets -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/app/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia

    <!-- Floating Install Notification Bar -->
    <div id="custom-install-banner" style="display: none !important;" class="fixed bottom-6 right-6 left-6 sm:left-auto bg-[var(--pitch,#0f172a)] text-white p-4 rounded-2xl shadow-2xl z-[9999] flex items-center justify-between gap-4 max-w-md border border-gray-700">
        <div>
            <h4 class="font-bold text-sm">Install App</h4>
            <p class="text-xs text-gray-300">Add EaseTracker to your home screen for quick single-tap access.</p>
        </div>
        <button id="pwa-install-trigger-btn" class="px-4 py-2 bg-[var(--amber,#f59e0b)] hover:bg-amber-600 text-white text-xs font-bold rounded-xl whitespace-nowrap shadow">
            Install Now
        </button>
    </div>
    <script>
        (function() {
            let deferredPrompt = null;
            const banner = document.getElementById('custom-install-banner');
            const installBtn = document.getElementById('pwa-install-trigger-btn');

            // Register Service Worker with explicit root path
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js', {
                            scope: '/'
                        })
                        .then(reg => console.log('PWA Service Worker registered:', reg.scope))
                        .catch(err => console.error('PWA Service Worker failed:', err));
                });
            }

            window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                deferredPrompt = e;

                if (banner) {
                    banner.style.setProperty('display', 'flex', 'important');
                }
            });

            if (installBtn) {
                installBtn.addEventListener('click', async () => {
                    if (!deferredPrompt) return;

                    deferredPrompt.prompt();
                    const choice = await deferredPrompt.userChoice;

                    if (choice.outcome === 'accepted') {
                        if (banner) banner.style.setProperty('display', 'none', 'important');
                    }
                    deferredPrompt = null;
                });
            }
        })();
    </script>
</body>

</html>