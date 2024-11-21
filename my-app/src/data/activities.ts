export interface Activity {
  id: number;
  title: string;
  image: string;
  description?: string;
  date: string;
  time: string;
  venue: string;
  fee: string;
  rulesId: string;
}

export const activities: Activity[] = [
  {
    id: 1,
    title: 'Cine Quiz :',
    image: 'https://firebasestorage.googleapis.com/v0/b/flim-382d5.appspot.com/o/Activities%2FCine%20Quiz.png?alt=media&token=c076d187-3702-470c-af37-2b3ac37ca8a6',
    date: 'January 10, 2025',
    time: '10:00 AM - 4:00 PM',
    venue: 'Main Auditorium',
    fee: '$20',
    rulesId: 'cine-quiz', // Link to the Cine Quiz rules
  },
  {
    id: 2,
    title: 'Movie Poster Design Contest ',
    image: 'https://firebasestorage.googleapis.com/v0/b/flim-382d5.appspot.com/o/Activities%2FMovie%20Poster%20Making.png?alt=media&token=405679cd-8c74-4bf5-aaa6-a90e64d106a5',
    date: 'January 11, 2025',
    time: '11:00 AM - 5:00 PM',
    venue: 'Exhibition Hall',
    fee: '$15',
    rulesId: 'movie-poster-design', // Link to Movie Poster Design rules
  },
  {
    id: 3,
    title: 'Photography Contest - Mobile Photograph:',
    image: 'https://firebasestorage.googleapis.com/v0/b/flim-382d5.appspot.com/o/Activities%2FPhotography%20Contest.png?alt=media&token=da8d10a5-2680-42cb-9a96-47f4f611d59d',
    description: 'Stories worth sharing. Stories worth hearing.',
    date: 'January 12, 2025',
    time: '9:00 AM - 3:00 PM',
    venue: 'Library Conference Room',
    fee: '$10',
    rulesId: 'photography-contest', // Link to Photography Contest rules
  },
  {
    id: 4,
    title: 'Spot Events',
    image: 'https://firebasestorage.googleapis.com/v0/b/flim-382d5.appspot.com/o/Activities%2FReel%20Contest.png?alt=media&token=3212d484-9e1a-4038-81da-d736950c8aab',
    description: "Don't miss the action. It's going to be epic!",
    date: 'January 10-12, 2025',
    time: 'Various Times',
    venue: 'Multiple Locations',
    fee: '$5 per event',
    rulesId: 'reel-making-contest', // Link to Reel Making Contest rules
  },
  {
    id: 5,
    title: 'Art Exhibitions',
    image: 'https://firebasestorage.googleapis.com/v0/b/flim-382d5.appspot.com/o/Activities%2FShort%20Flim%20Contest%20.png?alt=media&token=76ed45a2-8ff4-49e0-a070-4f0834e391f5',
    description: 'Photography just got better.',
    date: 'January 10-12, 2025',
    time: '9:00 AM - 6:00 PM',
    venue: 'Art Gallery',
    fee: '$12',
    rulesId: 'short-film-contest', // Link to Short Film Contest rules
  }
];
