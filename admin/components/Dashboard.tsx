
import React, { useState, useEffect } from 'react';

import RegistrationsManager from './management/RegistrationsManager';

import SpeakersManager from './management/SpeakersManager';

import ProgramManager from './management/ProgramManager';

import SponsorsManager from './management/SponsorsManager';

import FaqManager from './management/FaqManager';

import TestimonialsManager from './management/TestimonialsManager';

import TeamManager from './management/TeamManager';

import UsersManager from './management/UsersManager';

import SeoManager from './management/SeoManager';
import axios from 'axios';

import GalleryManager from './management/GalleryManager';
import CheckinManager from './management/CheckinManager'; // Import the new CheckinManager
import SettingsManager from './management/SettingsManager'; // Import the new SettingsManager
import ContactManager from './management/ContactManager'; // Import the new ContactManager
import NewsletterManager from './management/NewsletterManager'; // Import the new NewsletterManager
import PassTypesManager from './management/PassTypesManager'; // Import the new PassTypesManager
import PartnershipManager from './management/PartnershipManager'; // Import the new PartnershipManager
import ContentBlocksManager from './management/ContentBlocksManager'; // Import the new ContentBlocksManager
import MediaAssetsManager from './management/MediaAssetsManager'; // Import the new MediaAssetsManager

import { Line, Doughnut, Bar } from 'react-chartjs-2';

import {

  Chart as ChartJS,

  CategoryScale,

  LinearScale,

  PointElement,

  LineElement,

  BarElement,

  ArcElement,

  Title,

  Tooltip,

  Legend,

  ChartData

} from 'chart.js';



ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);



const API_URL = 'http://localhost:4000/api';



export interface AuthUser {

    name: string;

    role: 'admin' | 'manager';

}



interface RecentRegistration {

    id: number;

    first_name: string;

    last_name: string;

    pass_type: string;

}



interface RecentSubscriber {

    id: number;

    email: string;

}



// Stat Card Component

const StatCard: React.FC<{ title: string; value: string; icon: string, isLoading: boolean }> = ({ title, value, icon, isLoading }) => (

    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center gap-6">

        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">

            <i className={`${icon} text-3xl text-green-600 dark:text-green-400`}></i>

        </div>

        <div>

            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">{title}</p>

            {isLoading ? <div className="w-12 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1"></div> : <p className="text-3xl font-bold text-gray-800 dark:text-white">{value}</p>}

        </div>

    </div>

);



// Dashboard Overview Component

const DashboardOverview: React.FC = () => {

    const [stats, setStats] = useState({

        registrations: 0,

        speakers: 0,

        sponsors: 0,

        newsletterSubscribers: 0,

        contactMessages: 0,

        partnershipRequests: 0,

        mediaAssets: 0,

        contentBlocks: 0,

        galleryImages: 0,

        teamMembers: 0

    });

    const [lineChartData, setLineChartData] = useState<ChartData<"line">>({

        labels: [],

        datasets: []

    });

    const [doughnutData, setDoughnutData] = useState<ChartData<"doughnut">>({

        labels: [],

        datasets: []

    });

    const [barData, setBarData] = useState<ChartData<"bar">>({

        labels: [],

        datasets: []

    });

    const [recentRegistrations, setRecentRegistrations] = useState<RecentRegistration[]>([]);

    const [recentSubscribers, setRecentSubscribers] = useState<RecentSubscriber[]>([]);

    

    const [isLoading, setIsLoading] = useState(true);

    const [isChartsLoading, setIsChartsLoading] = useState(true);

    const [isTablesLoading, setIsTablesLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);



    useEffect(() => {

        const fetchData = async () => {

            try {

                setIsLoading(true);

                setIsChartsLoading(true);

                setIsTablesLoading(true);

                

                const [statsRes, lineChartRes, doughnutRes, barRes, regRes, newsletterRes] = await Promise.all([

                    fetch(`${API_URL}/stats`),

                    fetch(`${API_URL}/stats/registrations-by-day`),

                    fetch(`${API_URL}/stats/registrations-by-type`),

                    fetch(`${API_URL}/stats/speakers-by-category`),

                    fetch(`${API_URL}/registrations?limit=5`),

                    fetch(`${API_URL}/newsletter?limit=5`),

                ]).catch(err => { throw new Error("Network error: " + err.message); });



                // Process stats

                if (!statsRes.ok) throw new Error('Failed to fetch stats');

                const statsData = await statsRes.json();

                

                setStats(statsData); // statsData now contains all counts including galleryImages and teamMembers

                setIsLoading(false);



                // Process Line Chart

                if (!lineChartRes.ok) throw new Error('Failed to fetch line chart data');

                const rawLineData: { date: string; count: number }[] = await lineChartRes.json();

                const lineLabels: string[] = [], linePoints: number[] = [];

                const lineDateMap = new Map(rawLineData.map(i => [new Date(i.date).toDateString(), i.count]));

                for (let i = 29; i >= 0; i--) {

                    const d = new Date();

                    d.setDate(d.getDate() - i);

                    lineLabels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

                    linePoints.push(lineDateMap.get(d.toDateString()) || 0);

                }

                setLineChartData({ labels: lineLabels, datasets: [{ label: 'Inscriptions', data: linePoints, borderColor: '#00A859', backgroundColor: 'rgba(0, 168, 89, 0.1)', fill: true, tension: 0.4 }] });



                // Process Doughnut Chart

                if (!doughnutRes.ok) throw new Error('Failed to fetch doughnut chart data');

                const rawDoughnutData: { label: string; value: number }[] = await doughnutRes.json();

                setDoughnutData({

                    labels: rawDoughnutData.map(d => d.label.replace('_', ' ')),

                    datasets: [{

                        label: 'Inscriptions par Type',

                        data: rawDoughnutData.map(d => d.value),

                        backgroundColor: ['#00A859', '#34D399', '#6EE7B7', '#A7F3D0'],

                        borderColor: '#fff',

                    }]

                });



                // Process Bar Chart

                if (!barRes.ok) throw new Error('Failed to fetch bar chart data');

                const rawBarData: { label: string; value: number }[] = await barRes.json();

                setBarData({

                    labels: rawBarData.map(d => d.label),

                    datasets: [{ label: 'Speakers par Catégorie', data: rawBarData.map(d => d.value), backgroundColor: 'rgba(0, 168, 89, 0.6)' }]

                });

                setIsChartsLoading(false);

                

                // Process tables

                if (!regRes.ok) throw new Error('Failed to fetch recent registrations');

                const regData = await regRes.json();

                setRecentRegistrations(regData.data ? regData.data : regData);



                if (!newsletterRes.ok) throw new Error('Failed to fetch recent subscribers');

                const newsletterData = await newsletterRes.json();

                setRecentSubscribers(newsletterData);

                setIsTablesLoading(false);



            } catch (err) {

                setError(err instanceof Error ? err.message : 'An unknown error occurred');

                setIsLoading(false);

                setIsChartsLoading(false);

                setIsTablesLoading(false);

            }

        };

        fetchData();

    }, []);



    const chartCard = (title: string, children: React.ReactNode) => (

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">

            <h3 className="font-bold text-lg mb-4">{title}</h3>

            {isChartsLoading ? <div className="h-48 flex justify-center items-center">Chargement...</div> : children}

        </div>

    );

    

    return (

        <div className="space-y-8">

            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Aperçu du Tableau de Bord</h2>

            {error && <div className="text-red-500 bg-red-100 p-4 rounded-lg">Erreur: {error}</div>}

            

            <div className="grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">

                <StatCard title="Inscriptions" value={stats.registrations.toLocaleString()} icon="fas fa-users" isLoading={isLoading} />

                <StatCard title="Speakers" value={stats.speakers.toLocaleString()} icon="fas fa-microphone-alt" isLoading={isLoading} />

                <StatCard title="Sponsors" value={stats.sponsors.toLocaleString()} icon="fas fa-handshake" isLoading={isLoading} />

                <StatCard title="Abonnés Newsletter" value={stats.newsletterSubscribers.toLocaleString()} icon="fas fa-envelope-open-text" isLoading={isLoading} />

                <StatCard title="Messages Contact" value={stats.contactMessages.toLocaleString()} icon="fas fa-envelope" isLoading={isLoading} />

                <StatCard title="Demandes Partenariat" value={stats.partnershipRequests.toLocaleString()} icon="fas fa-handshake-alt" isLoading={isLoading} />

                <StatCard title="Actifs Médias" value={stats.mediaAssets.toLocaleString()} icon="fas fa-photo-video" isLoading={isLoading} />

                <StatCard title="Blocs Contenu" value={stats.contentBlocks.toLocaleString()} icon="fas fa-cube" isLoading={isLoading} />

                <StatCard title="Images Galerie" value={stats.galleryImages.toLocaleString()} icon="fas fa-images" isLoading={isLoading} />

                <StatCard title="Membres de l'Équipe" value={stats.teamMembers.toLocaleString()} icon="fas fa-users-cog" isLoading={isLoading} />

            </div>



            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div className="lg:col-span-2">

                    {chartCard("Inscriptions (30 derniers jours)", <Line options={{ responsive: true, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } }} data={lineChartData} />)}

                </div>

                <div className="space-y-8">

                    {chartCard("Inscriptions par Type", <Doughnut data={doughnutData} options={{ responsive: true, plugins: { legend: { position: 'top' }}}}/>)}

                    {chartCard("Speakers par Catégorie", <Bar data={barData} options={{ responsive: true, indexAxis: 'y', plugins: { legend: { display: false }}}}/>)}

                </div>

            </div>



            <div className="grid lg:grid-cols-2 gap-8">

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">

                     <h3 className="font-bold text-lg mb-4">Dernières Inscriptions</h3>

                     {isTablesLoading ? <div className="text-center py-4 text-gray-500">Chargement...</div> : recentRegistrations.length > 0 ? (

                        <table className="w-full text-left text-sm">

                            <tbody>{recentRegistrations.map(reg => (

                                <tr key={reg.id} className="border-b border-gray-200 dark:border-gray-700"><td className="p-2">{reg.first_name} {reg.last_name}</td><td className="p-2 text-right"><span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 capitalize">{reg.pass_type.replace('_', ' ')}</span></td></tr>

                            ))}</tbody>

                        </table>

                        ) : <div className="text-center py-4 text-gray-500">Aucune inscription récente.</div>}

                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">

                    <h3 className="font-bold text-lg mb-4">Nouveaux Abonnés Newsletter</h3>

                    {isTablesLoading ? <div className="text-center py-4 text-gray-500">Chargement...</div> : recentSubscribers.length > 0 ? (

                        <ul className="space-y-2">{recentSubscribers.map(sub => (

                            <li key={sub.id} className="flex justify-between items-center text-sm p-2 border-b border-gray-200 dark:border-gray-700">

                               <span>{sub.email}</span>

                               <a href={`mailto:${sub.email}`} className="text-blue-500 hover:text-blue-700"><i className="fas fa-paper-plane"></i></a>

                            </li>

                           ))}</ul>

                       ) : <div className="text-center py-4 text-gray-500">Aucun nouvel abonné.</div>}

                </div>

            </div>

        </div>

    );

};





const Dashboard: React.FC = () => {

    const [activeView, setActiveView] = useState('dashboard');

    const [authUser, setAuthUser] = useState<AuthUser | null>(null);



    useEffect(() => {

        const userData = sessionStorage.getItem('authUser');

        if (userData) {

            setAuthUser(JSON.parse(userData));

        }

    }, []);

    

    const handleLogout = () => {

        sessionStorage.removeItem('authUser');

        window.location.href = '/admin/index.html';

    };



    const allNavItems = [

        { id: 'dashboard', label: 'Dashboard', icon: 'fa-tachometer-alt', roles: ['admin', 'manager'], group: 'main' },

        { id: 'registrations', label: 'Inscriptions', icon: 'fa-users', roles: ['admin'], group: 'content' },

        { id: 'speakers', label: 'Speakers', icon: 'fa-microphone-alt', roles: ['admin', 'manager'], group: 'content' },

        { id: 'program', label: 'Programme', icon: 'fa-calendar-alt', roles: ['admin', 'manager'], group: 'content' },

        { id: 'sponsors', label: 'Sponsors', icon: 'fa-handshake', roles: ['admin'], group: 'content' },

        { id: 'faq', label: 'FAQ', icon: 'fa-question-circle', roles: ['admin', 'manager'], group: 'content' },

                { id: 'testimonials', label: 'Témoignages', icon: 'fa-comment-dots', roles: ['admin', 'manager'], group: 'content' },

                { id: 'team', label: 'Équipe', icon: 'fa-users-cog', roles: ['admin'], group: 'content' },

                { id: 'gallery', label: 'Galerie', icon: 'fa-images', roles: ['admin', 'manager'], group: 'content' },

                        { id: 'checkin', label: 'Check-in', icon: 'fa-check-circle', roles: ['admin', 'manager'], group: 'content' }, // New Check-in item

                        { id: 'contact', label: 'Messages', icon: 'fa-envelope', roles: ['admin'], group: 'content' },

                                { id: 'newsletter', label: 'Newsletter', icon: 'fa-newspaper', roles: ['admin'], group: 'content' },

                                        { id: 'passes', label: 'Types de Pass', icon: 'fa-ticket-alt', roles: ['admin'], group: 'content' },

                                                { id: 'partnership', label: 'Partenariats', icon: 'fa-handshake', roles: ['admin'], group: 'content' },

                                                        { id: 'content-blocks', label: 'Blocs de Contenu', icon: 'fa-cube', roles: ['admin'], group: 'content' },

                                                        { id: 'media-assets', label: 'Actifs Médias', icon: 'fa-photo-video', roles: ['admin'], group: 'content' },

                                                        { id: 'users', label: 'Utilisateurs', icon: 'fa-user-shield', roles: ['admin'], group: 'admin' },

                                                        { id: 'seo', label: 'Paramètres SEO', icon: 'fa-chart-line', roles: ['admin'], group: 'admin' },

                                                        { id: 'settings', label: 'Paramètres du Site', icon: 'fa-cog', roles: ['admin'], group: 'admin' },

                                                    ];

                                                

                                                    const navItems = allNavItems.filter(item => authUser && item.roles.includes(authUser.role));

                                                

                                                    const renderContent = () => {

                                                        switch (activeView) {

                                                            case 'dashboard': return <DashboardOverview />;

                                                            case 'registrations': return <RegistrationsManager />;

                                                            case 'speakers': return <SpeakersManager authUser={authUser} />;

                                                            case 'program': return <ProgramManager authUser={authUser} />;

                                                            case 'sponsors': return <SponsorsManager />;

                                                            case 'faq': return <FaqManager authUser={authUser} />;

                                                            case 'testimonials': return <TestimonialsManager authUser={authUser} />;

                                                            case 'team': return <TeamManager />;

                                                            case 'gallery': return <GalleryManager authUser={authUser} />;

                                                            case 'checkin': return <CheckinManager />; // Render CheckinManager

                                                            case 'contact': return <ContactManager />;

                                                            case 'newsletter': return <NewsletterManager />;

                                                            case 'passes': return <PassTypesManager />;

                                                            case 'partnership': return <PartnershipManager />;

                                                            case 'content-blocks': return <ContentBlocksManager />;

                                                            case 'media-assets': return <MediaAssetsManager />;

                                                                        case 'users': return <UsersManager />;

                                                                        case 'seo': return <SeoManager />;

                                                                        case 'settings': return <SettingsManager />; // Render SettingsManager

                                                            default: return <div>Select a section</div>;

                                                        }

                                                    };



    const renderNavGroup = (group: string, title?: string) => (

        <div className="pt-4">

           {title && <h3 className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>}

            <div className="space-y-1">

                {navItems.filter(i => i.group === group).map(item => (

                    <a

                        key={item.id}

                        href="#"

                        onClick={(e) => { e.preventDefault(); setActiveView(item.id); }}

                        className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${activeView === item.id ? 'bg-green-600 text-white shadow-lg' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}

                    >

                        <i className={`fas ${item.icon} w-6 text-center`}></i>

                        <span className="font-semibold">{item.label}</span>

                    </a>

                ))}

            </div>

        </div>

    );



    return (

        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">

            {/* Sidebar */}

            <aside className="w-64 bg-white dark:bg-gray-800 shadow-md flex flex-col">

                                <div className="p-4 text-center border-b border-gray-200 dark:border-gray-700">

                                     <img src="/assets/images/logo.png" alt="Logo" className="h-15 w-auto mx-auto" />

                                </div>

                <nav className="flex-1 px-4 py-2">

                    {renderNavGroup('main')}

                    {renderNavGroup('content', 'Gestion Contenu')}

                    {authUser?.role === 'admin' && renderNavGroup('admin', 'Administration')}

                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">

                    {authUser && (

                        <div className="text-center mb-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-900">

                            <p className="font-bold text-sm">{authUser.name}</p>

                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{authUser.role}</p>

                        </div>

                    )}

                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors font-semibold">

                       <i className="fas fa-sign-out-alt"></i>

                       <span>Logout</span>

                    </button>

                </div>

            </aside>



            {/* Main Content */}

            <main className="flex-1 p-10 overflow-y-auto">

               {renderContent()}

            </main>

        </div>

    );

};



export default Dashboard;
