import React, { useState, useEffect } from 'react';
import PageHero from '../components/ui/PageHero';
import { TeamMember } from '../utils/types';
import { API_URL, UPLOADS_URL } from '../utils/config';
import { useSettings } from '../contexts/SettingsContext'; // New import

const TeamMemberCard: React.FC<{ member: TeamMember }> = ({ member }) => {
  const getFullImageUrl = (path: string) => {
      if (!path) return ''; // or a placeholder image
      if (path.startsWith('http')) return path;
      return `${UPLOADS_URL}${path}`;
  };
  
  return (
    <div className="group relative bg-white/5 dark:bg-black/10 backdrop-blur-md border border-white/10 dark:border-black/20 rounded-2xl p-6 text-center shadow-lg transition-all duration-300 hover:bg-white/10 hover:dark:bg-black/20 hover:scale-105">
      <div className="relative w-32 h-32 mx-auto -mt-16 mb-4">
        <img src={getFullImageUrl(member.image_url)} alt={member.name} className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-gray-800" />
      </div>
      <h3 className="text-xl font-bold">{member.name}</h3>
      <p className="text-brand-green font-semibold mb-4">{member.role_fr}</p>
      <div className="flex justify-center gap-4">
          {member.linkedin_url && (
              <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s LinkedIn`} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 text-white hover:bg-brand-green transition-colors">
                  <i className="fab fa-linkedin-in"></i>
              </a>
          )}
          {member.twitter_url && (
              <a href={member.twitter_url} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s Twitter`} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 text-white hover:bg-brand-green transition-colors">
                  <i className="fab fa-twitter"></i>
              </a>
          )}
      </div>
    </div>
  );
}

const TeamPage: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { settings, isLoading: settingsLoading } = useSettings(); // New: Get settings and their loading state


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

  const volunteerText = "Vous souhaitez faire partie de notre équipe de bénévoles et contribuer au succès de l'Africa Power Platform ? Rejoignez-nous !";
  const volunteerButton = settings.volunteer_form_link ? (
    <a 
      href={settings.volunteer_form_link} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="mt-6 inline-block bg-brand-green text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
    >
      Devenir bénévole
    </a>
  ) : null;


  return (
    <div>
        <PageHero
            title={<>Notre <span className="text-brand-green">Équipe</span></>}
            subtitle="Les visages derrière l'organisation de l'Africa Power Platform."
        > {/* Children for PageHero */}
            {/* Display button always for diagnosis */}
            <div className="mt-8">
                <p className="text-lg md:text-xl text-gray-300 mb-4 px-4 max-w-2xl mx-auto">
                    {volunteerText}
                </p>
                {volunteerButton || <p className="text-red-300">Lien Volontaire non configuré dans l'administration.</p>}
            </div>
        </PageHero>
        <section id="team" className="py-24 bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-gray-900 dark:to-black">
          <div className="max-w-7xl mx-auto px-6">
            {isLoading && <div className="text-center">Chargement de l'équipe...</div>}
            {error && <div className="text-center text-red-500">Erreur: {error}</div>}
            
            {!isLoading && !error && (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-20 pt-16">
                  {teamMembers.map((member) => <TeamMemberCard key={member.id} member={member} />)}
                </div>
            )}
            {!isLoading && !error && teamMembers.length === 0 && (
                <p className="text-center text-gray-500">L'équipe d'organisation sera bientôt présentée.</p>
            )}
          </div>
        </section>
    </div>
  );
};

export default TeamPage;
