
import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

interface TeamMember {
  name: string;
  roleKey: string;
  image: string;
  linkedin: string;
  twitter: string;
}

const teamMembers: TeamMember[] = [
  { name: 'Samuel Adebayo', roleKey: 'team.role1', image: 'https://picsum.photos/400/400?random=20', linkedin: '#', twitter: '#' },
  { name: 'Ngozi Okonjo', roleKey: 'team.role2', image: 'https://picsum.photos/400/400?random=21', linkedin: '#', twitter: '#' },
  { name: 'Kwame Appiah', roleKey: 'team.role3', image: 'https://picsum.photos/400/400?random=22', linkedin: '#', twitter: '#' },
  { name: 'Amina Diallo', roleKey: 'team.role4', image: 'https://picsum.photos/400/400?random=23', linkedin: '#', twitter: '#' },
];

const TeamMemberCard: React.FC<{ member: TeamMember }> = ({ member }) => {
  const { t } = useTranslation();
  return (
    <div className="group text-center transition-transform duration-300 hover:-translate-y-2">
        <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden shadow-lg mb-4 border-4 border-gray-200 dark:border-gray-800 group-hover:border-brand-green transition-colors duration-300">
            <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex gap-4">
                    <a href={member.linkedin} aria-label={`${member.name}'s LinkedIn`} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 text-white hover:bg-brand-green transition-colors"><i className="fab fa-linkedin-in"></i></a>
                    <a href={member.twitter} aria-label={`${member.name}'s Twitter`} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 text-white hover:bg-brand-green transition-colors"><i className="fab fa-twitter"></i></a>
                </div>
            </div>
        </div>
        <h3 className="text-xl font-bold">{member.name}</h3>
        <p className="text-brand-green font-semibold">{t(member.roleKey)}</p>
    </div>
  );
}

const Team: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section id="team" className="py-24 bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-gray-900 dark:to-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-brand-green font-semibold text-sm tracking-widest uppercase">{t('team.pre_title')}</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4">
            {t('team.title_part1')} <span className="text-brand-green">{t('team.title_part2')}</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {teamMembers.map((member, index) => <TeamMemberCard key={index} member={member} />)}
        </div>
      </div>
    </section>
  );
};

export default Team;
