export type DestinationId = 'web' | 'official';

export interface Destination {
  id: DestinationId;
  label: string;
  url: string;
}

export const DESTINATIONS: Record<DestinationId, Destination> = {
  web: {
    id: 'web',
    label: 'mAI Web',
    url: 'https://mai-officiel.vercel.app',
  },
  official: {
    id: 'official',
    label: 'Officiel',
    url: 'https://mai-devs.vercel.app',
  },
};

export const DESTINATION_KEY = 'mai_pulse_destination';

export function parseDestination(value: unknown): DestinationId {
  return value === 'official' ? 'official' : 'web';
}

export function getDestination(id: DestinationId): Destination {
  return DESTINATIONS[id];
}

export function toggleDestinationId(id: DestinationId): DestinationId {
  return id === 'web' ? 'official' : 'web';
}

export function getSwitcherCss(): string {
  return `
        .dest-switch {
            display: inline-flex;
            align-items: center;
            padding: 2px;
            gap: 2px;
            background: var(--vscode-editor-background, rgba(0,0,0,0.25));
            border: 1px solid var(--vscode-sideBar-border, rgba(255,255,255,0.12));
            border-radius: 6px;
        }

        .dest-btn {
            background: transparent;
            border: none;
            color: var(--vscode-descriptionForeground, #888888);
            padding: 3px 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 10px;
            font-weight: 600;
            font-family: inherit;
        }

        .dest-btn:hover {
            color: var(--vscode-foreground, #cccccc);
            background: var(--vscode-toolbar-hoverBackground, rgba(255,255,255,0.08));
        }

        .dest-btn.active {
            color: var(--vscode-button-foreground, #ffffff);
            background: var(--vscode-button-background, #007acc);
        }
  `;
}

export function getSwitcherMarkup(active: DestinationId): string {
  const webActive = active === 'web' ? ' active' : '';
  const officialActive = active === 'official' ? ' active' : '';
  return `
            <div class="dest-switch" role="group" aria-label="Destination">
                <button class="dest-btn${webActive}" data-dest="web" onclick="switchDestination('web')" title="mAI Web — mai-officiel.vercel.app">mAI Web</button>
                <button class="dest-btn${officialActive}" data-dest="official" onclick="switchDestination('official')" title="Site officiel — mai-devs.vercel.app">Officiel</button>
            </div>`;
}

export function getSwitcherScript(): string {
  return `
        function switchDestination(id) {
            vscode.postMessage({
                type: 'setDestination',
                destination: id
            });
        }

        function applyDestination(id, url, label) {
            document.querySelectorAll('.dest-btn').forEach((btn) => {
                btn.classList.toggle('active', btn.getAttribute('data-dest') === id);
            });
            const loader = document.getElementById('loader');
            const loaderText = document.querySelector('.loader-text');
            if (loader) {
                loader.style.display = 'flex';
                loader.style.opacity = '1';
            }
            if (loaderText && label) {
                loaderText.textContent = 'Chargement de ' + label + '...';
            }
            const iframe = document.getElementById('maiIframe');
            if (iframe) {
                iframe.src = url;
            }
        }

        window.addEventListener('message', (event) => {
            const msg = event.data;
            if (msg && msg.type === 'setDestination') {
                applyDestination(msg.destination, msg.url, msg.label);
            }
        });
  `;
}
