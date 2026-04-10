import { getCurrent } from '@/fetures/auth/action';
import SignInCard from '@/fetures/auth/components/sign-in-card'
import { redirect } from 'next/navigation';

const page = async() => {
  const user = await getCurrent(); 
  
    if (user)redirect("/dashboard")
  return (
  <SignInCard/>
  )
}

export default page