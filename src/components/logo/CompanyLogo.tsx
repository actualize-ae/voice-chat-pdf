import Image from 'next/image'
import companyLogo from '../../../public/company-logo.svg'

export const CompanyLogo = () => {
    return <Image src={companyLogo} alt="Company Logo" />
}