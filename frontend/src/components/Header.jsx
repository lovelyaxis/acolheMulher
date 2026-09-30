import {useState} from 'react';
import { Navlink ,Link } from 'react-router-dom';
import logo from "../assets/logo-acolhemulher.png"


const navItems = [
    {to: '/', label: 'Home'},
    {to: '/como-funciona', label: 'Como Funciona'},
    {to: '/tipos-de-acolhimento', label: 'Tipos de Acolhimento'},
    {to: '/rede-de-atedimento', label: 'Rede de Atendimento'},
    {to: '/sobre', label: 'Sobre'},
    {to: '/ajuda', label: 'Ajuda'},
]
export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    
    return (
        <header className='sticky top-0 z-50 border-b border-[#E7E1F5] bg-white'>
            <div className='mx-auto flex max-w-[1200] items-center gap-6 px-6 py-4 md:px-8'>
                {/* logo paezão */}

                <link to='/' className='flex shrink-0 items-center gap-2.5'>
                <img src="{logo}" alt="logo acolhe mulher" className='h-10 w-auto'/>

                <span className='flex flex-col leading-tight'>
                    <span className='text-lg font-bold text-[#241d45]'>
                    AcolheMulher
                    </span>
                </span>
                </link>

            </div>
        </header>
    );
}
