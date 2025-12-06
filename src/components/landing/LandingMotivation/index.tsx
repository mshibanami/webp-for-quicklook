import { TranslatedMarkdown } from 'docusaurus-i18n-markup';
import useBaseUrl from "@docusaurus/useBaseUrl";
import Heading from '@theme/Heading';

export default function LandingMotivation() {
    return (
        <section className={'sectionContainer'}>
            <div>
                <Heading as="h2">
                    <TranslatedMarkdown
                        id="landingPage.motivationTitle.markdown"
                        components={{ p: 'span' }}
                    >
                        {"What's wrong with default Quick Look?"}
                    </TranslatedMarkdown>
                </Heading>
                <p>
                    <TranslatedMarkdown
                        id="landingPage.motivationText.markdown"
                    >
                        {"While Quick Look does support animated WebP natively, it may not play animated WebP files smoothly. For example, 60 fps animated WebP files may be played at ~20 fps. Download the following WebP file to test it on your Mac:"}
                    </TranslatedMarkdown>
                </p>
                <ul>
                    <li>
                        <a
                            href={useBaseUrl('/img/sample_60fps_cup.webp')}
                            target="_blank"
                            rel="noreferrer">
                            <b>
                                30 fps animated WebP sample 1
                            </b>
                        </a>
                    </li>
                    <li>
                        <a
                            href={useBaseUrl('/img/sample_60fps_space.webp')}
                            target="_blank"
                            rel="noreferrer">
                            <b>
                                60 fps animated WebP sample 2
                            </b>
                        </a>
                    </li>
                </ul>
                <p>
                    <TranslatedMarkdown
                        id="landingPage.motivationSuggestionText.markdown"
                    >
                        {"(We suggest using a Chromium-based browser (e.g., Google Chrome, Microsoft Edge) to check the original speed since their built-in WebP renderers work great.)"}
                    </TranslatedMarkdown>
                </p>
            </div>
        </section>
    );
}
