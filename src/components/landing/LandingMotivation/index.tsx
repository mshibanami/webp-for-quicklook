import MarkdownI18n from '../../MarkdownI18n';
import useBaseUrl from "@docusaurus/useBaseUrl";
import Heading from '@theme/Heading';

export default function LandingMotivation() {
    return (
        <section className={'sectionContainer'}>
            <div>
                <Heading as="h2">
                    <MarkdownI18n
                        id="landingPage.motivationTitle.markdown"
                        components={{ p: 'span' }}
                    >
                        {"What's wrong with default Quick Look?"}
                    </MarkdownI18n>
                </Heading>
                <p>
                    <MarkdownI18n
                        id="landingPage.motivationText.markdown"
                    >
                        {"While Quick Look does support animated WebP natively, it may not play animated WebP files smoothly. For example, 60FPS animated WebP files may be played at ~20FPS. Download the following WebP file to test it on your Mac:"}
                    </MarkdownI18n>
                </p>
                <ul>
                    <li>
                        <a
                            href={useBaseUrl('/img/sample_60fps_cup.webp')}
                            target="_blank"
                            rel="noreferrer">
                            <b>
                                30FPS animated WebP sample 1
                            </b>
                        </a>
                    </li>
                    <li>
                        <a
                            href={useBaseUrl('/img/sample_60fps_space.webp')}
                            target="_blank"
                            rel="noreferrer">
                            <b>
                                60FPS animated WebP sample 2
                            </b>
                        </a>
                    </li>
                </ul>
                <p>
                    <MarkdownI18n
                        id="landingPage.motivationSuggestionText.markdown"
                    >
                        {"(We suggest using a Chromium-based browser (e.g., Google Chrome, Microsoft Edge) to check the original speed since their built-in WebP renderers work great.)"}
                    </MarkdownI18n>
                </p>
            </div>
        </section>
    );
}
