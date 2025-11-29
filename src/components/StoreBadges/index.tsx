import useBaseUrl from "@docusaurus/useBaseUrl"
import Image from "../Image"

export default function StoreBadges() {
    return (
        <a href="https://apps.apple.com/app/id6755811088">
            <Image
                src={useBaseUrl('/img/appstore-badge.svg')}
                alt="Download on the Mac App Store"
                height={60}
                margin="0"
            />
        </a>
    )
};
