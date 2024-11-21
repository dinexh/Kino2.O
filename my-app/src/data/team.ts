interface TeamMember {
  id: number;
  name: string;
  image: string;
  designation: string;
  instagram: string;
  telegram: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    image: "/path/to/image1",
    designation: "Creative Director",
    instagram: "https://instagram.com/sarahjcreative",
    telegram: "https://t.me/sarahjcreative"
  },
  {
    id: 2,
    name: "Michael Chen",
    image: "/path/to/image2",
    designation: "Lead Designer",
    instagram: "https://instagram.com/mchendesigns",
    telegram: "https://t.me/mchendesigns"
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    image: "/path/to/image3",
    designation: "UI/UX Designer",
    instagram: "https://instagram.com/emmadesigns",
    telegram: "https://t.me/emmadesigns"
  },
  {
    id: 4,
    name: "David Kim",
    image: "/path/to/image4",
    designation: "Visual Artist",
    instagram: "https://instagram.com/davidkimart",
    telegram: "https://t.me/davidkimart"
  },
  {
    id: 5,
    name: "Lisa Patel",
    image: "/path/to/image5",
    designation: "Project Manager",
    instagram: "https://instagram.com/lisapatel",
    telegram: "https://t.me/lisapatel"
  },
  {
    id: 6,
    name: "Alex Thompson",
    image: "/path/to/image6",
    designation: "Content Creator",
    instagram: "https://instagram.com/alexcreates",
    telegram: "https://t.me/alexcreates"
  }
];
