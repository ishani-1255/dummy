import React, { useState } from 'react';
import {
  Building2, Users, Printer, FileText, Trash2, Edit, Plus,
  Mail, Bell, Phone, Globe, Linkedin, Github, Star,
  Calendar, MapPin, Award, BookOpen, Briefcase, X,
  ChartBar, GraduationCap, ExternalLink, Download, Search,
  Info, Building
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  Card, CardHeader1, CardHeader, CardTitle, CardContent,
  Tabs, TabsList, TabsTrigger, TabsContent,
  Button, Input, Textarea, Badge,
  Alert, AlertDescription,
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
  TooltipProvider, Tooltip, TooltipContent, TooltipTrigger,
  ScrollArea
} from '../admin/UIComponents';
import Sidebar from './Sidebar';

const Profile = () => {
  // Existing states from the original component...
  const [studentInfo, setStudentInfo] = useState({
    name: "Ayush Kumar",
    rollNo: "CS21B042",
    email: "alex.k@university.edu",
    phone: "+1234567890",
    department: "Computer Science",
    batch: "2021-25",
    semester: 6,
    cgpa: 8.92,
    profileImage: "/api/placeholder/150/150",
    about: "Passionate computer science student with interest in AI/ML and web development.",
    skills: ["React", "Python", "Machine Learning", "Node.js", "SQL"],
    interests: ["Artificial Intelligence", "Web Development", "Cloud Computing"],
    achievements: [
      { title: "First Prize - National Hackathon 2023", date: "2023" },
      { title: "Best Student Project Award", date: "2023" }
    ],
    links: {
      linkedin: "linkedin.com/in/alexk",
      github: "github.com/alexk",
      portfolio: "alexk.dev"
    }
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState(null);
  
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "AI Chat Application",
      description: "Built a real-time chat application with AI capabilities",
      technologies: ["React", "Node.js", "OpenAI API"],
      link: "https://github.com/example/ai-chat"
    },
    {
      id: 2,
      title: "Student Management System",
      description: "Developed a full-stack student management system",
      technologies: ["React", "Express", "MongoDB"],
      link: "https://github.com/example/sms"
    }
  ]);

  const [education, setEducation] = useState({
    ssc: {
      school: "City High School",
      board: "State Board",
      percentage: 95,
      year: 2019
    },
    hsc: {
      school: "City Junior College",
      board: "State Board",
      percentage: 92,
      year: 2021
    },
    graduation: {
      school: "University Institute of Technology",
      board: "Technical University",
      percentage: 89,
      year: 2025
    }
  });

  const [technicalSkills, setTechnicalSkills] = useState({
    programmingLanguages: ["Python", "JavaScript", "Java", "C++"],
    technologies: ["React", "Node.js", "Express", "MongoDB"],
    tools: ["Git", "Docker", "AWS", "VS Code"],
    certifications: [
      {
        name: "AWS Solutions Architect",
        issuer: "Amazon Web Services",
        date: "2023"
      },
      {
        name: "Full Stack Development",
        issuer: "Meta",
        date: "2023"
      }
    ]
  });

  // New states for modals
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
  const [isEditCertificationModalOpen, setIsEditCertificationModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isInterestModalOpen, setIsInterestModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [newInterest, setNewInterest] = useState("");
  
  // States for mail and notifications
  const [mailboxOpen, setMailboxOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sample notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'interview',
      title: 'Interview Scheduled',
      message: 'Your interview with Google has been scheduled for tomorrow at 2:00 PM.',
      timestamp: '2 hours ago',
      status: 'unread'
    },
    {
      id: 2,
      type: 'placement',
      title: 'Placement Update',
      message: 'Congratulations! You have been placed at Microsoft.',
      timestamp: '1 day ago',
      status: 'read'
    },
    {
      id: 3,
      type: 'company',
      title: 'New Company Registration',
      message: 'Amazon has registered for campus placements.',
      timestamp: '2 days ago',
      status: 'read'
    }
  ]);
  
  // Function to handle filtered notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || notification.type === activeTab;
    
    return matchesSearch && matchesTab;
  });

  // Function to handle notification actions
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({
      ...notification,
      status: 'read'
    })));
  };
  
  // Function to handle interest deletion
  const handleDeleteInterest = (index) => {
    const updatedInterests = [...studentInfo.interests];
    updatedInterests.splice(index, 1);
    setStudentInfo({...studentInfo, interests: updatedInterests});
  };
  
  // Function to handle adding a new interest
  const handleAddInterest = () => {
    if (newInterest.trim()) {
      setStudentInfo({
        ...studentInfo, 
        interests: [...studentInfo.interests, newInterest.trim()]
      });
      setNewInterest("");
      setIsInterestModalOpen(false);
    }
  };
  
  // Function to handle project deletion
  const handleDeleteProject = (projectId) => {
    setProjects(projects.filter(p => p.id !== projectId));
  };
  
  // Function to handle achievement deletion
  const handleDeleteAchievement = (index) => {
    const updatedAchievements = [...studentInfo.achievements];
    updatedAchievements.splice(index, 1);
    setStudentInfo({...studentInfo, achievements: updatedAchievements});
  };
  
  // Function to handle achievement addition/edit
  const handleSaveAchievement = (achievement, isEdit = false, index = null) => {
    if (isEdit && index !== null) {
      const updatedAchievements = [...studentInfo.achievements];
      updatedAchievements[index] = achievement;
      setStudentInfo({...studentInfo, achievements: updatedAchievements});
    } else {
      setStudentInfo({
        ...studentInfo,
        achievements: [...studentInfo.achievements, achievement]
      });
    }
    setSelectedAchievement(null);
    setIsAchievementModalOpen(false);
  };

  // Stats data
  const stats = [
    { title: "CGPA", value: studentInfo.cgpa, icon: ChartBar, color: "bg-blue-100 text-blue-600" },
    { title: "Semester", value: studentInfo.semester, icon: Calendar, color: "bg-green-100 text-green-600" },
    { title: "Projects", value: projects.length, icon: Briefcase, color: "bg-purple-100 text-purple-600" },
    { title: "Skills", value: studentInfo.skills.length, icon: Star, color: "bg-orange-100 text-orange-600" }
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          {/* Enhanced Header with Stats */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Student Profile</h1>
                <p className="text-gray-500">Manage your academic profile and achievements</p>
              </div>
              <div className="flex space-x-4">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => setMailboxOpen(true)}
                >
                  <Mail className="h-4 w-4" />
                </Button>
                <Button 
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => setNotificationsOpen(true)}
                >
                  <Bell className="h-4 w-4 " />
                  
                </Button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-4 flex pt-4 items-center space-x-4">
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                      <h3 className="text-xl font-bold">{stat.value}</h3>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-4 gap-6">
            {/* Left Column - Profile Card */}
            <div className="col-span-1">
              <Card className="sticky top-6">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <img
                        src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                        alt="Profile"
                        className="w-32 h-32 rounded-full mb-4"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute bottom-0 right-0 rounded-full bg-white"
                        onClick={() => setIsPhotoModalOpen(true)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <h2 className="text-xl font-semibold">{studentInfo.name}</h2>
                    <Badge variant="secondary" className="mt-2">
                      {studentInfo.rollNo}
                    </Badge>
                    <div className="mt-4 w-full space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Mail className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-sm">{studentInfo.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Phone className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-sm">{studentInfo.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Building2 className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-sm">{studentInfo.department}</span>
                      </div>
                    </div>
                    <div className="mt-6 flex gap-2">
                      {Object.entries(studentInfo.links).map(([platform, url]) => (
                        <TooltipProvider key={platform}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                              >
                                {platform === 'linkedin' ? <Linkedin className="h-5 w-5 text-blue-600" /> :
                                 platform === 'github' ? <Github className="h-5 w-5 text-gray-700" /> :
                                 <Globe className="h-5 w-5 text-blue-600" />}
                              </a>
                            </TooltipTrigger>
                            <TooltipContent>{url}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Detailed Info */}
            <div className="col-span-3">
              <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <div className="space-y-6">
                    {/* About Section */}
                    <Card>
                      <CardHeader1 className="flex flex-row items-center justify-between">
                        <CardTitle>About Me</CardTitle>
                        <Button variant="outline" onClick={() => setIsEditMode(!isEditMode)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </CardHeader1>
                      <CardContent>
                        {isEditMode ? (
                          <Textarea
                            value={studentInfo.about}
                            onChange={(e) => setStudentInfo({...studentInfo, about: e.target.value})}
                            className="w-full"
                            rows={4}
                          />
                        ) : (
                          <p className="text-gray-600">{studentInfo.about}</p>
                        )}
                      </CardContent>
                    </Card>

                    {/* Interests Section */}
                    <Card>
                      <CardHeader1 className="flex flex-row items-center justify-between">
                        <CardTitle>Interests</CardTitle>
                        <Button variant="outline" onClick={() => setIsInterestModalOpen(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Interest
                        </Button>
                      </CardHeader1>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {studentInfo.interests.map((interest, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary" 
                              className="text-blue-600 bg-blue-100 flex items-center gap-2"
                            >
                              {interest}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0"
                                onClick={() => handleDeleteInterest(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Achievements Section */}
                    <Card>
                      <CardHeader1 className="flex flex-row items-center justify-between">
                        <CardTitle>Achievements</CardTitle>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            setSelectedAchievement(null);
                            setIsAchievementModalOpen(true);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Achievement
                        </Button>
                      </CardHeader1>
                      <CardContent>
                        <div className="space-y-4">
                          {studentInfo.achievements.map((achievement, index) => (
                            <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <Award className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">{achievement.title}</h4>
                                <p className="text-sm text-gray-500">{achievement.date}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setSelectedAchievement({...achievement, index});
                                    setIsAchievementModalOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteAchievement(index)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="education">
                  <Card>
                    <CardHeader1 className="flex flex-row items-center justify-between">
                      <CardTitle>Educational Background</CardTitle>
                      <Button onClick={() => setIsEducationModalOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Education
                      </Button>
                    </CardHeader1>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Level</TableHead>
                            <TableHead>Institution</TableHead>
                            <TableHead>Board/University</TableHead>
                            <TableHead>Score</TableHead>
                            <TableHead>Year</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(education).map(([level, details]) => {
                            if (level !== 'backlogs') {
                              return (
                                <TableRow key={level}>
                                  <TableCell className="font-medium">
                                    {level.toUpperCase()}
                                  </TableCell>
                                  <TableCell>{details.school}</TableCell>
                                  <TableCell>{details.board}</TableCell>
                                  <TableCell>{details.percentage}%</TableCell>
                                  <TableCell>{details.year}</TableCell>
                                  <TableCell>
                                    <div className="flex gap-2">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                          setSelectedEducation({ level, ...details });
                                          setIsEducationModalOpen(true);
                                        }}
                                      >
                                        <Edit className="h-4 w-4 text-blue-600" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                          // Handle delete
                                          const newEducation = { ...education };
                                          delete newEducation[level];
                                          setEducation(newEducation);
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4 text-red-600" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            }
                            return null;
                          })}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="skills">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader1 className="flex flex-row items-center justify-between">
                        <CardTitle>Technical Skills</CardTitle>
                        <Button onClick={() => setIsSkillModalOpen(true)}>
                          <Plus className="h-4 w-4 mr-2" /> Add Skill
                        </Button>
                      </CardHeader1>
                      <CardContent>
                        <div className="space-y-6">
                          {Object.entries(technicalSkills).map(([category, skills]) => (
                            <div key={category} className="space-y-2">
                              <h3 className="text-lg font-semibold capitalize">
                                {category.replace(/([A-Z])/g, " $1").trim()}
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {Array.isArray(skills) && typeof skills[0] === "string" ? (
                                  skills.map((skill, index) => (
                                    <Badge
                                      key={index}
                                      className="px-3 py-1 flex items-center gap-2 bg-blue-100 text-blue-600 hover:bg-blue-200"
                                    >
                                      {skill}
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 p-0"
                                        onClick={() => {
                                          const newSkills = { ...technicalSkills };
                                          newSkills[category] = skills.filter((_, i) => i !== index);
                                          setTechnicalSkills(newSkills);
                                        }}
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </Badge>
                                  ))
                                ) : (
                                  <div className="flex flex-col space-y-2 w-full">
                                    {skills.map((cert, index) => (
                                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                          <p className="font-medium">{cert.name}</p>
                                          <p className="text-sm text-gray-500">
                                            {cert.issuer} - {cert.date}
                                          </p>
                                        </div>
                                        <div className="flex gap-2">
                                          <Button 
                                            variant="ghost" 
                                            size="icon"
                                            onClick={() => {
                                              setSelectedCertification({...cert, index});
                                              setIsEditCertificationModalOpen(true);
                                            }}
                                          >
                                            <Edit className="h-4 w-4 text-blue-600" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => {
                                              const newSkills = { ...technicalSkills };
                                              newSkills[category] = skills.filter((_, i) => i !== index);
                                              setTechnicalSkills(newSkills);
                                            }}
                                          >
                                            <Trash2 className="h-4 w-4 text-red-600" />
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="projects">
                  <Card>
                    <CardHeader1 className="flex flex-row items-center justify-between">
                      <CardTitle>Projects</CardTitle>
                      <Button onClick={() => setIsProjectModalOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Project
                      </Button>
                    </CardHeader1>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {projects.map((project) => (
                          <div key={project.id} className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                              <h3 className="font-semibold text-lg">{project.title}</h3>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setSelectedProject(project);
                                    setIsEditProjectModalOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteProject(project.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-gray-600 mt-2">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              {project.technologies.map((tech, index) => (
                                <Badge key={index} variant="outline">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                            {project.link && (
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-600 mt-3 text-sm hover:underline"
                              >
                                <ExternalLink className="h-4 w-4" />
                                View Project
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Add Project Modal */}
      <Dialog open={isProjectModalOpen} onOpenChange={setIsProjectModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Title</label>
              <Input placeholder="Enter project title" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea placeholder="Describe your project" rows={4} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Technologies Used</label>
              <Input placeholder="React, Node.js, etc." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Link</label>
              <Input placeholder="https://github.com/..." />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsProjectModalOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                Add Project
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Project Modal */}
      <Dialog open={isEditProjectModalOpen} onOpenChange={setIsEditProjectModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Title</label>
              <Input placeholder="Enter project title" value={selectedProject?.title || ''} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                placeholder="Describe your project" 
                rows={4}
                value={selectedProject?.description || ''} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Technologies Used</label>
              <Input 
                placeholder="React, Node.js, etc." 
                value={selectedProject?.technologies.join(', ') || ''} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Link</label>
              <Input 
                placeholder="https://github.com/..." 
                value={selectedProject?.link || ''} 
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditProjectModalOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Skill Modal */}
      <Dialog open={isSkillModalOpen} onOpenChange={setIsSkillModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Skill</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Skill Category</label>
              <select className="w-full p-2 border rounded-md">
                <option value="programmingLanguages">Programming Languages</option>
                <option value="technologies">Technologies</option>
                <option value="tools">Tools</option>
                <option value="certifications">Certifications</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Skill Name</label>
              <Input placeholder="Enter skill name" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsSkillModalOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                Add Skill
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Education Modal */}
      <Dialog open={isEducationModalOpen} onOpenChange={setIsEducationModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedEducation ? "Edit Education" : "Add Education"}
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Education Level</label>
              <select 
                className="w-full p-2 border rounded-md"
                defaultValue={selectedEducation?.level || ""}
              >
                <option value="" disabled>Select level</option>
                <option value="ssc">SSC (10th)</option>
                <option value="hsc">HSC (12th)</option>
                <option value="graduation">Graduation</option>
                <option value="postgraduation">Post Graduation</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Institution Name</label>
              <Input 
                placeholder="Enter institution name" 
                defaultValue={selectedEducation?.school || ""} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Board/University</label>
              <Input 
                placeholder="Enter board/university" 
                defaultValue={selectedEducation?.board || ""} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Percentage/CGPA</label>
                <Input 
                  type="number" 
                  placeholder="Enter percentage"
                  defaultValue={selectedEducation?.percentage || ""} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Year of Completion</label>
                <Input 
                  type="number" 
                  placeholder="Enter year"
                  defaultValue={selectedEducation?.year || ""} 
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setIsEducationModalOpen(false);
                setSelectedEducation(null);
              }}>
                Cancel
              </Button>
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                {selectedEducation ? "Save Changes" : "Add Education"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Achievement Modal */}
      <Dialog open={isAchievementModalOpen} onOpenChange={setIsAchievementModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedAchievement ? "Edit Achievement" : "Add Achievement"}
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const achievement = {
              title: formData.get('title'),
              date: formData.get('date')
            };
            
            if (selectedAchievement) {
              handleSaveAchievement(achievement, true, selectedAchievement.index);
            } else {
              handleSaveAchievement(achievement);
            }
          }}>
            <div className="space-y-2">
              <label className="text-sm font-medium">Achievement Title</label>
              <Input 
                name="title"
                placeholder="Enter achievement title" 
                defaultValue={selectedAchievement?.title || ""} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Year/Date</label>
              <Input 
                name="date"
                placeholder="Enter year or date" 
                defaultValue={selectedAchievement?.date || ""} 
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => {
                setIsAchievementModalOpen(false);
                setSelectedAchievement(null);
              }}>
                Cancel
              </Button>
              <Button className="bg-blue-600 text-white hover:bg-blue-700" type="submit">
                {selectedAchievement ? "Save Changes" : "Add Achievement"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Certification Modal */}
      <Dialog open={isEditCertificationModalOpen} onOpenChange={setIsEditCertificationModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Certification</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Certification Name</label>
              <Input 
                placeholder="Enter certification name" 
                defaultValue={selectedCertification?.name || ""} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Issuing Organization</label>
              <Input 
                placeholder="Enter issuer" 
                defaultValue={selectedCertification?.issuer || ""} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date of Certification</label>
              <Input 
                placeholder="Month, Year" 
                defaultValue={selectedCertification?.date || ""} 
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditCertificationModalOpen(false);
                  setSelectedCertification(null);
                }}
              >
                Cancel
              </Button>
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Change Photo Modal */}
      <Dialog open={isPhotoModalOpen} onOpenChange={setIsPhotoModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Profile Photo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center">
              <img
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                alt="Current Profile"
                className="w-32 h-32 rounded-full mb-4"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Upload New Photo</label>
              <Input type="file" accept="image/*" />
            </div>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Image should be a square JPG or PNG file, maximum 5MB.
              </AlertDescription>
            </Alert>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsPhotoModalOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                Update Photo
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Interest Modal */}
      <Dialog open={isInterestModalOpen} onOpenChange={setIsInterestModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Interest</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Interest</label>
              <Input 
                placeholder="Enter a new interest" 
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsInterestModalOpen(false);
                  setNewInterest("");
                }}
              >
                Cancel
              </Button>
              <Button 
                className="bg-blue-600 text-white hover:bg-blue-700"
                onClick={handleAddInterest}
              >
                Add Interest
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notifications Dialog */}
      <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-xl">Notifications</DialogTitle>
            <DialogDescription>
              Stay updated with your placement activities
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-between items-center mb-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="interview">Interviews</TabsTrigger>
                <TabsTrigger value="placement">Placements</TabsTrigger>
                <TabsTrigger value="company">Companies</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          </div>
          
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search notifications..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>
          
          <ScrollArea className="max-h-[50vh]">
            <div className="space-y-3 pr-3">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Bell className="h-10 w-10 mx-auto mb-3 opacity-20" />
                  <p>No notifications found</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-3 rounded-lg border ${notification.status === 'unread' ? 'bg-blue-50 border-blue-100' : 'bg-white'}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <div className={`p-2 rounded-full 
                          ${notification.type === 'interview' ? 'bg-purple-100' : 
                            notification.type === 'placement' ? 'bg-green-100' : 'bg-blue-100'}`}>
                          {notification.type === 'interview' ? 
                            <Calendar className="h-4 w-4 text-purple-600" /> : 
                            notification.type === 'placement' ? 
                              <Award className="h-4 w-4 text-green-600" /> : 
                              <Building className="h-4 w-4 text-blue-600" />
                          }
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{notification.title}</div>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6"
                        onClick={() => removeNotification(notification.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      
      {/* Mail Dialog */}
      <Dialog open={mailboxOpen} onOpenChange={setMailboxOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-xl">Messages</DialogTitle>
            <DialogDescription>
              Communicate with placement officers and companies
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-between items-center mb-4">
            <Tabs defaultValue="inbox">
              <TabsList>
                <TabsTrigger value="inbox">Inbox</TabsTrigger>
                <TabsTrigger value="sent">Sent</TabsTrigger>
                <TabsTrigger value="drafts">Drafts</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Compose
            </Button>
          </div>
          
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search messages..." 
              className="flex-1"
            />
          </div>
          
          <ScrollArea className="max-h-[50vh]">
            <div className="space-y-1 pr-3">
              {/* Sample messages */}
              <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer border-b">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium">Placement Office</span>
                    <span className="text-xs text-gray-500">10:30 AM</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-1">Interview schedule for Amazon has been updated</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer border-b">
                <div className="p-2 bg-green-100 rounded-full">
                  <Building2 className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium">Google Recruiters</span>
                    <span className="text-xs text-gray-500">Yesterday</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-1">Thank you for your application to Google</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer border-b">
                <div className="p-2 bg-purple-100 rounded-full">
                  <FileText className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium">Resume Verification</span>
                    <span className="text-xs text-gray-500">Feb 20</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-1">Your resume has been verified for the upcoming placement season</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
                <div className="p-2 bg-orange-100 rounded-full">
                  <BookOpen className="h-4 w-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium">Training Department</span>
                    <span className="text-xs text-gray-500">Feb 18</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-1">New interview preparation workshops scheduled</p>
                </div>
              </div>
            </div>
          </ScrollArea>
          
          <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
            <span>4 unread messages</span>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;