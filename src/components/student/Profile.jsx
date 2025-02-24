import React, { useState } from 'react';
import {
  Building2, Users, Printer, FileText, Trash2, Edit, Plus,
  Mail, Bell, Phone, Globe, Linkedin, Github, Star,
  Calendar, MapPin, Award, BookOpen, Briefcase, X,
  ChartBar, GraduationCap, ExternalLink, Download, Search
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  Card, CardHeader, CardTitle, CardContent,
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
    name: "Alex Kumar",
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
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Function to handle project deletion
  const handleDeleteProject = (projectId) => {
    setProjects(projects.filter(p => p.id !== projectId));
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
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Profile
                </Button>
                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-4 flex items-center space-x-4">
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
                        src={studentInfo.profileImage}
                        alt="Profile"
                        className="w-32 h-32 rounded-full mb-4"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute bottom-0 right-0 rounded-full bg-white"
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
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>About Me</CardTitle>
                        <Button variant="outline" onClick={() => setIsEditMode(!isEditMode)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </CardHeader>
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
                      <CardHeader>
                        <CardTitle>Interests</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {studentInfo.interests.map((interest, index) => (
                            <Badge key={index} variant="secondary" className="text-blue-600 bg-blue-100">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Achievements Section */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Achievements</CardTitle>
                        <Button variant="outline">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Achievement
                        </Button>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {studentInfo.achievements.map((achievement, index) => (
                            <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <Award className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-medium">{achievement.title}</h4>
                                <p className="text-sm text-gray-500">{achievement.date}</p>
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
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Educational Background</CardTitle>
                      <Button onClick={() => setIsEducationModalOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Education
                      </Button>
                    </CardHeader>
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Technical Skills</CardTitle>
            <Button onClick={() => setIsSkillModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add Skill
            </Button>
          </CardHeader>
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
                              <Button variant="ghost" size="icon">
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
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Projects</CardTitle>
                      <Button onClick={() => setIsProjectModalOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Project
                      </Button>
                    </CardHeader>
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
              

      {/* Add necessary modals here... */}

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
              <label className="text-sm font-medium">Category</label>
              <select className="w-full border rounded-md p-2">
                <option value="programmingLanguages">Programming Languages</option>
                <option value="technologies">Technologies</option>
                <option value="tools">Tools</option>
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
              {selectedEducation ? 'Edit Education' : 'Add Education'}
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Level</label>
              <select className="w-full border rounded-md p-2">
                <option value="ssc">SSC (10th)</option>
                <option value="hsc">HSC (12th)</option>
                <option value="graduation">Graduation</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Institution</label>
              <Input placeholder="Enter institution name" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Board/University</label>
              <Input placeholder="Enter board or university name" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Score (%)</label>
              <Input type="number" placeholder="Enter percentage" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Year of Completion</label>
              <Input type="number" placeholder="Enter year" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setIsEducationModalOpen(false);
                setSelectedEducation(null);
              }}>
                Cancel
              </Button>
              <Button className="bg-blue-600 text-white hover:bg-blue-700">
                {selectedEducation ? 'Save Changes' : 'Add Education'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;