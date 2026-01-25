import React, { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { TeamMember } from '../utils/types';
import { API_URL } from '../utils/config';

const TeamMemberCard: React.FC<{ member: TeamMember }> = ({ member }) => {
  const { t, language } = useTranslation();
  return (
    <div className="group text-center transition-transform duration-300 hover:-translate-y-2">
        <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden shadow-lg mb-4 border-4 border-gray-200 dark:border-gray-800 group-hover:border-brand-green transition-colors duration-300">
            <img src={member.image_url} alt={member.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex gap-4">
                    {member.linkedin_url && (
                        <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s LinkedIn`} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 text-white hover:bg-brand-green transition-colors">
                            <i className="fab fa-linkedin-in"></i>
                        </a>
                    )}
                    {member.twitter_url && (
                        <a href={member.twitter_url} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s Twitter`} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/20 text-white hover:bg-brand-green transition-colors">
                            <i className="fab fa-twitter"></i>
                        </a>
                    )}
                </div>
            </div>
        </div>
        <h3 className="text-xl font-bold">{member.name}</h3>
        <p className="text-brand-green font-semibold">{language === 'fr' ? member.role_fr : member.role_en}</p>
    </div>
  );
}

const Team: React.FC = () => {
  const { t } = useTranslation();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      const fetchTeam = async () => {
          try {
              const response = await fetch(`${API_URL}/team`);
              if (!response.ok) {
                  throw new Error('Failed to fetch team data.');
              }
              const data: TeamMember[] = await response.json();
              setTeamMembers(data.filter(m => m.is_active));
          } catch (err) {
              setError(err instanceof Error ? err.message : 'An unknown error occurred');
          } finally {
              setIsLoading(false);
          }
      };

      fetchTeam();
  }, []);

  return (
    <section id="team" className="py-24 bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-gray-900 dark:to-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-brand-green font-semibold text-sm tracking-widest uppercase">{t('team.pre_title')}</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4">
            {t('team.title_part1')} <span className="text-brand-green">{t('team.title_part2')}</span>
          </h2>
        </div>
        
        {isLoading && <div className="text-center">Chargement de l'équipe...</div>}
        {error && <div className="text-center text-red-500">Erreur: {error}</div>}
        
        {!isLoading && !error && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
              {teamMembers.map((member) => <TeamMemberCard key={member.id} member={member} />)}
            </div>
        )}
        {!isLoading && !error && teamMembers.length === 0 && (
            <p className="text-center text-gray-500">L'équipe d'organisation sera bientôt présentée.</p>
        )}
      </div>
    </section>
  );
};

export default Team;