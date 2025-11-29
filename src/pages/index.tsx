import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import LandingPageBackground from '@site/src/components/landing/LandingPageBackground';
import Image from "@site/src/components/Image";
import styles from './index.module.scss';
import Translate, { translate } from '@docusaurus/Translate';
import Head from '@docusaurus/Head';
import LandingPageFAQ from '../components/landing/LandingPageFAQ';
import StoreBadges from '../components/StoreBadges';

function LandingPageHero() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <header className={clsx('hero', styles.heroBanner)}>
            <div className={clsx("container", styles.heroContainer)}>
                <Heading as="h1" className="hero__title margin-top--lg">
                    {siteConfig.tagline}
                </Heading>

                <div className={clsx('margin-bottom--lg', styles.heroVideoContainer)}>
                    <video
                        className={styles.heroVideo}
                        src={useBaseUrl('/videos/landing-demo.mov')}
                        playsInline
                        autoPlay
                        loop
                        preload="metadata"
                        aria-label="Demo video"
                        muted
                    >
                        Your browser does not support the video tag. You can
                        <a href={useBaseUrl('/videos/landing-demo.mov')} target="_blank" rel="noreferrer">
                            download the video
                        </a>.
                    </video>
                </div>

                <div className="margin-bottom--lg">
                    <StoreBadges />
                </div>
                <p className="hero__subtitle margin-bottom--lg">
                    <Translate
                        id="landingPage.heroSubtitle"
                        description="Landing page hero subtitle"
                        values={{ appName: <b>WebP for Quick Look</b> }}
                    >
                        {'{appName} is a Quick Look extension that enables smooth previews for animated WebP files.'}
                    </Translate>
                </p>
            </div>
        </header>
    );
}

function useScrollAnimation() {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -80px 0px'
            }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return { ref, isVisible };
}

export default function Home(): ReactNode {
    const { siteConfig } = useDocusaurusContext();
    const headerAnimation = useScrollAnimation();
    const useFAQAnimation = useScrollAnimation();
    const titleDescription = translate({
        id: "landingPage.metadataTitleDescription",
        description: "Short description of the app for the landing page metadata",
        message: "Fixes Native Glitches"
    })
    const appName = siteConfig.title;
    const title = `${appName} – ${titleDescription}`;
    const description = translate(
        {
            id: "landingPage.heroSubtitle",
            description: "Landing page hero subtitle",
            message: '{appName} fixes native glitches on macOS.'
        },
        { appName }
    );

    return (
        <div className='indexPage'>
            <Layout
                title={title}
                description={description}>
                <main>
                    <LandingPageBackground style={{ height: "600px", width: "100%" }} />
                    <div ref={headerAnimation.ref} className={clsx(styles.animatedSection, {
                        [styles.visible]: headerAnimation.isVisible
                    })}>
                        <LandingPageHero />
                    </div>
                    <div ref={useFAQAnimation.ref} className={clsx(styles.animatedSection, {
                        [styles.visible]: useFAQAnimation.isVisible
                    })}>
                        <LandingPageFAQ />
                    </div>
                    <div className="container margin-bottom--xl text--center">
                        <StoreBadges />
                    </div>
                </main>
            </Layout>

            <Head titleTemplate="%s">
                <title>{title}</title>
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
            </Head>
        </div>
    );
}
