import Image from 'next/image'
import companyLogo from '../../../public/company-logo.svg'

export const CompanyLogo = ({
    className = ""
}: {
    className?: string
}) => {
    return <Image className={className} src={companyLogo} alt="Company Logo" />
}