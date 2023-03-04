import Footer from "../components/Footer"
import Head from "next/head"
import Image from "next/image"
import {ToastContainer, toast} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import Logo from "../assets/logo.png"
import Link from "next/link"
import PrimaryFiled from "../components/PrimaryField"
import PasswordField from "../components/PasswordField"
import AuthButton from "../components/AuthButton"
import { useContext, useEffect, useState } from "react"
import { useRouter } from "next/router"
import axios from "axios";
import { AppContext } from "../contexts/AppContext";

export default function LogIn() {
    const { currentPage, setCurrentPage, changeCurrentPageName } = useContext(AppContext);
    const route = useRouter();

    useEffect(() => {
        changeCurrentPageName('login');
    }, [currentPage, setCurrentPage]);

    const [formData, setFromData] = useState({
        email:"",
        password:""
    })

    const{email, password} = formData;

    const onChange = (e) => {
        setFromData((prevVal) => ({
            ...prevVal,
            [e.target.id]: e.target.value,
        }))
    }

    // function to submit the login form
    const onSubmit = async (e) => {
        e.preventDefault()

        const formDetails = {email, password};

        const apiEndPoint = 'http://localhost:5000/api/v1/u/login';
        if (!email || !password) {
            toast.error('Fields cannot be empty', {autoClose: 1000});
            return;
        } 

        await axios.post(apiEndPoint, formDetails)
            .then((response) => {
                toast.success("logged in successfull", {autoClose: 1000})
                console.log(response.data);
                if(typeof window !== 'undefined') {
                    localStorage.setItem('userToken', JSON.stringify(response.data));
                    route.push('/MyPage');
                }
            })
            .catch(error => {
                toast.error(error.response.data, {autoClose: 1000});
            });
    }

    return(
        <>
             <Head>
                <title>Login — Fund a Friend</title>
                <meta name="description" content="Generated by create next app" />
            </Head>
            <main className='md:px-2 flex flex-col h-screen'>
                <div className="flex flex-col items-center mt-20">
                    <Link href="/">
                        <Image className="w-60 mb-10" src={Logo} alt="fundLogo" />
                    </Link>

                    <PrimaryFiled 
                        label="Email"
                        type="Email"
                        placeholder="Enter email"
                        id="email"
                        value={email}
                        onChange={onChange}
                        />
                    <PasswordField 
                        label="Password"
                        placeholder="Enter password"
                        id="password"
                        value={password}
                        onChange={onChange}
                        />
                    <AuthButton
                        text="Sign In"
                        onClick={onSubmit} />

                    {/* <button className="border-2 rounded-full border-white p-3 w-[20rem] bg-white/[50%] hover:bg-white hover:border-mainBlue transition-colors ease-in duration-300 mb-4">
                    Continue with Google
                    </button>
                    <button className="border-2 rounded-full border-white p-3 w-[20rem] bg-white/[50%] hover:bg-mainBlue transition-colors ease-in duration-300 mb-4">
                    Continue with Twitter
                    </button> */}
                    {/* <p className="text-center text-[0.8rem] pt-5">By signing up, you agree to Fund a Friend&apos;s
                        <br />Terms of Service, Privacy Policy
                    </p> */}
                </div>
            </main>
        </>
    )
}