import { getCurrent } from '@/fetures/auth/action';
import SignUpCard from '@/fetures/auth/components/sign-up-card'
import { redirect } from 'next/navigation';
import React from 'react'
export const dynamic = "force-dynamic";
const page = async() => {
   const user = await getCurrent(); 
    
      if (user)redirect("/dashboard")
  return (
   <SignUpCard/>
  )
}

export default page