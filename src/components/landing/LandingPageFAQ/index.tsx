import type { ReactNode } from 'react';
import { useState } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import MarkdownI18n from '../../MarkdownI18n';
import styles from './styles.module.scss';

interface FAQItem {
    question: ReactNode;
    answer: ReactNode;
}

const faqItems: FAQItem[] = [
    {
        question: (
            <MarkdownI18n
                id="landingPageFAQ.whyNotReport.question.markdown"
            >
                Why don't you report this issue to Apple?
            </MarkdownI18n>
        ),
        answer: (
            <div>
                <p>
                    <MarkdownI18n
                        id="landingPageFAQ.whyNotReport.answer.markdown"
                        values={{ videoLink: "/videos/before-tahoe.mov" }}
                    >
                        {'We reported this to Apple in 2024, and they did improve it! ([It was actually much worse before macOS Tahoe.]({videoLink})) However, even with those improvements, high-frame-rate WebP files are still capped as shown in the comparison video. In addition, it also remains a major problem for users on older macOS versions. That’s why we created this app for people who need it.'}
                    </MarkdownI18n>
                </p>
            </div>
        )
    },
    {
        question: (
            <MarkdownI18n
                id="landingPageFAQ.pricing.question.markdown"
                components={{ p: 'span' }}
            >
                What is the pricing model?
            </MarkdownI18n>
        ),
        answer: (
            <div>
                <p>
                    <MarkdownI18n
                        id="landingPageFAQ.pricing.answer.markdown"
                    >
                        Free + one-time purchase. It's free to download from the Mac App Store, and you can preview an unlimited number of static WebP files, as well as up to 10 animated WebP files per hour. This allows you to try the app and make sure it meets your needs. Once you unlock the full version with a one-time in-app purchase (priced about the cost of a cup of coffee ☕️), you can enjoy unlimited previews.
                    </MarkdownI18n>
                </p>
            </div>
        )
    },
];

interface FAQAccordionItemProps {
    item: FAQItem;
    isOpen: boolean;
    onClick: () => void;
}

function FAQAccordionItem({ item, isOpen, onClick }: FAQAccordionItemProps): ReactNode {
    return (
        <div className={clsx(styles.faqItem, { [styles.open]: isOpen })}>
            <button
                className={styles.faqQuestion}
                onClick={onClick}
                aria-expanded={isOpen}
            >
                <span className={styles.questionText}>{item.question}</span>
                <svg
                    className={styles.icon}
                    aria-hidden="true"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>
            <div className={clsx(styles.faqAnswer, { [styles.show]: isOpen })}>
                <div className={styles.answerWrapper}>
                    <div className={styles.answerContent}>
                        {item.answer}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LandingPageFAQ(): ReactNode {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleItem = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className={clsx('container', styles.faqSection)}>
            <div className={styles.faqHeader}>
                <Heading as="h2">
                    <MarkdownI18n
                        id="landingPageFAQ.title.markdown"
                        components={{ p: 'span' }}
                    >
                        Frequently Asked Questions
                    </MarkdownI18n>
                </Heading>
            </div>
            <div className={styles.faqContainer}>
                {faqItems.map((item, index) => (
                    <FAQAccordionItem
                        key={index}
                        item={item}
                        isOpen={openIndex === index}
                        onClick={() => toggleItem(index)}
                    />
                ))}
            </div>
        </div>
    );
}
