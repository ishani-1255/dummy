import React, { useState, useEffect } from "react";
import { useUser } from "../../pages/UserContext";
import {
  Building2,
  Users,
  Printer,
  FileText,
  Trash2,
  Edit,
  Plus,
  Mail,
  Bell,
  Phone,
  Globe,
  Linkedin,
  Github,
  Star,
  Calendar,
  MapPin,
  Award,
  BookOpen,
  Briefcase,
  X,
  ChartBar,
  GraduationCap,
  ExternalLink,
  Download,
  Search,
  Info,
  Building,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Card,
  CardHeader1,
  CardHeader,
  CardTitle,
  CardContent,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Button,
  Input,
  Textarea,
  Badge,
  Alert,
  AlertDescription,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  ScrollArea,
} from "../admin/UIComponents";
import Sidebar from "./Sidebar";
import axios from "axios";

const Profile = () => {
  const { currentUser, updateUserContext } = useUser();
  const [studentInfo, setStudentInfo] = useState({
    name: currentUser?.name || "Student User",
    rollNo: currentUser?.registrationNumber || "regNo",
    email: currentUser?.email || "johndoe@gmail.com",
    phone: currentUser?.phone || "1234567890",
    department: currentUser?.branch,
    batch: "2021-25",
    semester: currentUser?.semester || 1,
    cgpa: currentUser?.cgpa || 10.0,
    backlog: currentUser?.backlog || 0,
    profileImage: "/api/placeholder/150/150",
    about:
      "Passionate computer science student with interest in AI/ML and web development.",
    skills: ["React", "Python", "Machine Learning", "Node.js", "SQL"],
    interests: [
      "Artificial Intelligence",
      "Web Development",
      "Cloud Computing",
    ],
    achievements: [
      { title: "First Prize - National Hackathon 2023", date: "2023" },
      { title: "Best Student Project Award", date: "2023" },
    ],
    links: {
      linkedin: "linkedin.com/in/alexk",
      github: "github.com/alexk",
      portfolio: "alexk.dev",
    },
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState(null);

  const [projects, setProjects] = useState([]);
  const [education, setEducation] = useState({});
  const [technicalSkills, setTechnicalSkills] = useState({
    programmingLanguages: [],
    technologies: [],
    tools: [],
    certifications: [],
  });

  // New states for profile data
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
  const [isEditCertificationModalOpen, setIsEditCertificationModalOpen] =
    useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isInterestModalOpen, setIsInterestModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [newInterest, setNewInterest] = useState("");

  // Form states
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    technologies: "",
    link: "",
  });
  const [newEducation, setNewEducation] = useState({
    level: "",
    school: "",
    board: "",
    percentage: "",
    year: "",
  });
  const [newSkill, setNewSkill] = useState({
    category: "programmingLanguages",
    skill: "",
  });
  const [newCertification, setNewCertification] = useState({
    name: "",
    issuer: "",
    date: "",
  });
  const [newAchievement, setNewAchievement] = useState({
    title: "",
    date: "",
  });

  // States for mail and notifications
  const [mailboxOpen, setMailboxOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:6400/api/student/profile",
          {
            withCredentials: true,
          }
        );

        if (response.data) {
          console.log("Profile data received:", response.data);
          setProfileData(response.data);

          // Update state with profile data
          setStudentInfo((prevInfo) => ({
            ...prevInfo,
            about: response.data.about || prevInfo.about,
            batch: response.data.batch || prevInfo.batch,
            skills: response.data.skills || prevInfo.skills,
            interests: response.data.interests || prevInfo.interests,
            achievements: response.data.achievements || prevInfo.achievements,
            links: response.data.links || prevInfo.links,
            profileImage: response.data.profileImage || prevInfo.profileImage,
          }));

          // Set projects from profile data
          setProjects(response.data.projects || []);

          // Create education object from array
          if (response.data.education && response.data.education.length > 0) {
            const eduObj = {};
            response.data.education.forEach((edu) => {
              eduObj[edu.level] = {
                school: edu.school,
                board: edu.board,
                percentage: edu.percentage,
                year: edu.year,
                _id: edu._id,
              };
            });
            setEducation(eduObj);
          }

          // Set technical skills
          if (response.data.technicalSkills) {
            setTechnicalSkills(response.data.technicalSkills);
          }
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Fetch notifications from backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setNotificationsLoading(true);
        console.log("Fetching notifications...");
        const response = await axios.get(
          "http://localhost:6400/api/notifications",
          { withCredentials: true }
        );

        console.log("Notifications response:", response);

        if (response.data) {
          // Process notifications to ensure valid timestamps
          const processedNotifications = response.data.map((notification) => {
            // Check if timestamp is valid, if not provide a fallback
            const validTimestamp =
              notification.timestamp &&
              !isNaN(new Date(notification.timestamp).getTime())
                ? notification.timestamp
                : new Date().toISOString(); // Use current date as fallback

            return {
              ...notification,
              timestamp: validTimestamp,
            };
          });

          setNotifications(processedNotifications);

          // Count unread notifications
          const unread = processedNotifications.filter(
            (notification) => notification.status === "unread"
          ).length;
          setUnreadCount(unread);
          console.log(
            `Found ${processedNotifications.length} notifications, ${unread} unread`
          );
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
        } else if (error.request) {
          console.error(
            "Request made but no response received:",
            error.request
          );
        } else {
          console.error("Error setting up request:", error.message);
        }
      } finally {
        setNotificationsLoading(false);
      }
    };

    fetchNotifications();

    // Poll for new notifications every 5 minutes
    const intervalId = setInterval(fetchNotifications, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Function to format dates consistently
  const formatDate = (dateString) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) {
      return "Date unavailable";
    }

    const date = new Date(dateString);

    // Check if it's today
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    // Check if it's yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    // Check if it's within the last week
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const isWithinLastWeek = date > lastWeek;

    if (isToday) {
      return `Today, ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (isYesterday) {
      return `Yesterday, ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (isWithinLastWeek) {
      // Show day of week for dates within last week
      const options = { weekday: "long", hour: "2-digit", minute: "2-digit" };
      return date.toLocaleString(undefined, options);
    } else {
      // For older dates show the full date
      const options = { year: "numeric", month: "short", day: "numeric" };
      return date.toLocaleDateString(undefined, options);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await axios.put(
        `http://localhost:6400/api/notifications/${notificationId}/read`,
        {},
        { withCredentials: true }
      );

      // Update local state
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => {
          if (notification._id === notificationId) {
            // When marking as read, ensure timestamp is valid
            const validTimestamp =
              notification.timestamp &&
              !isNaN(new Date(notification.timestamp).getTime())
                ? notification.timestamp
                : new Date().toISOString();

            return {
              ...notification,
              status: "read",
              timestamp: validTimestamp,
            };
          }
          return notification;
        })
      );

      // Update unread count
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await axios.put(
        "http://localhost:6400/api/notifications/mark-all-read",
        {},
        { withCredentials: true }
      );

      // Update local state
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => {
          // Ensure timestamp is valid for all notifications
          const validTimestamp =
            notification.timestamp &&
            !isNaN(new Date(notification.timestamp).getTime())
              ? notification.timestamp
              : new Date().toISOString();

          return {
            ...notification,
            status: "read",
            timestamp: validTimestamp,
          };
        })
      );

      // Reset unread count
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  // Function to remove notification
  const removeNotification = async (notificationId) => {
    try {
      await axios.delete(
        `http://localhost:6400/api/notifications/${notificationId}`,
        { withCredentials: true }
      );

      // Update local state
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => notification._id !== notificationId
        )
      );

      // Update unread count if needed
      const removed = notifications.find((n) => n._id === notificationId);
      if (removed && removed.status === "unread") {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Error removing notification:", error);
    }
  };

  // Function to handle filtered notifications
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || notification.type === activeTab;

    return matchesSearch && matchesTab;
  });

  // Function to handle skill addition
  const handleAddSkill = async (e) => {
    e.preventDefault();

    try {
      let requestData = {};

      if (newSkill.category === "certifications") {
        requestData = {
          category: "certifications",
          certData: newCertification,
        };
      } else {
        requestData = {
          category: newSkill.category,
          skill: newSkill.skill,
        };
      }

      const response = await axios.post(
        "http://localhost:6400/api/student/profile/skill",
        requestData,
        { withCredentials: true }
      );

      if (response.data && response.data.technicalSkills) {
        // Update the technical skills state
        setTechnicalSkills(response.data.technicalSkills);

        // If adding a general skill, update skills array too
        if (newSkill.category === "skills") {
          setStudentInfo((prevInfo) => ({
            ...prevInfo,
            skills: response.data.skills || prevInfo.skills,
          }));
        }

        // Reset form and close modal
        setNewSkill({
          category: "programmingLanguages",
          skill: "",
        });
        setNewCertification({
          name: "",
          issuer: "",
          date: "",
        });
        setIsSkillModalOpen(false);
        console.log("Skill added successfully");
      }
    } catch (error) {
      console.error("Error adding skill:", error);
      alert("Failed to add skill");
    }
  };

  // Function to handle skill/certification deletion
  const handleDeleteSkill = async (category, index) => {
    try {
      const response = await axios.delete(
        "http://localhost:6400/api/student/profile/skill",
        {
          data: { category, index },
          withCredentials: true,
        }
      );

      if (response.data) {
        if (category === "skills") {
          // Update the skills in studentInfo
          setStudentInfo((prevInfo) => ({
            ...prevInfo,
            skills: response.data.skills,
          }));
        } else {
          // Update technical skills
          setTechnicalSkills(response.data.technicalSkills);
        }
        console.log(`${category} skill deleted successfully`);
      }
    } catch (error) {
      console.error(`Error deleting ${category} skill:`, error);
      alert(`Failed to delete ${category} skill`);
    }
  };

  // Function to handle certification update
  const handleUpdateCertification = async (e) => {
    e.preventDefault();

    if (!selectedCertification) return;

    try {
      const response = await axios.post(
        "http://localhost:6400/api/student/profile/skill",
        {
          category: "certifications",
          index: selectedCertification.index,
          certData: {
            name: selectedCertification.name,
            issuer: selectedCertification.issuer,
            date: selectedCertification.date,
          },
        },
        { withCredentials: true }
      );

      if (response.data && response.data.technicalSkills) {
        // Update the technical skills state
        setTechnicalSkills(response.data.technicalSkills);

        // Reset state and close modal
        setSelectedCertification(null);
        setIsEditCertificationModalOpen(false);
        console.log("Certification updated successfully");
      }
    } catch (error) {
      console.error("Error updating certification:", error);
      alert("Failed to update certification");
    }
  };

  // Function to handle interest deletion
  const handleDeleteInterest = async (index) => {
    try {
      // Create a copy of interests array with the item removed
      const updatedInterests = [...studentInfo.interests];
      updatedInterests.splice(index, 1);

      const response = await axios.put(
        "http://localhost:6400/api/student/profile",
        { interests: updatedInterests },
        { withCredentials: true }
      );

      if (response.data) {
        setStudentInfo((prevInfo) => ({
          ...prevInfo,
          interests: response.data.interests,
        }));
        console.log("Interest deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting interest:", error);
      alert("Failed to delete interest");
    }
  };

  // Function to handle adding a new interest
  const handleAddInterest = async () => {
    if (!newInterest.trim()) return;

    try {
      const updatedInterests = [...studentInfo.interests, newInterest.trim()];

      const response = await axios.put(
        "http://localhost:6400/api/student/profile",
        { interests: updatedInterests },
        { withCredentials: true }
      );

      if (response.data) {
        setStudentInfo((prevInfo) => ({
          ...prevInfo,
          interests: response.data.interests,
        }));
        setNewInterest("");
        setIsInterestModalOpen(false);
        console.log("Interest added successfully");
      }
    } catch (error) {
      console.error("Error adding interest:", error);
      alert("Failed to add interest");
    }
  };

  // Function to handle achievement addition/edit
  const handleSaveAchievement = async (e) => {
    e.preventDefault();

    try {
      const achievementData = {
        title: newAchievement.title,
        date: newAchievement.date,
      };

      // If editing, include the ID
      if (selectedAchievement && selectedAchievement._id) {
        achievementData.id = selectedAchievement._id;
      }

      const response = await axios.post(
        "http://localhost:6400/api/student/profile/achievement",
        achievementData,
        { withCredentials: true }
      );

      if (response.data) {
        // Update achievements in studentInfo
        setStudentInfo((prevInfo) => ({
          ...prevInfo,
          achievements: response.data.achievements,
        }));

        // Reset form and close modal
        setNewAchievement({
          title: "",
          date: "",
        });
        setSelectedAchievement(null);
        setIsAchievementModalOpen(false);
        console.log("Achievement saved successfully");
      }
    } catch (error) {
      console.error("Error saving achievement:", error);
      alert("Failed to save achievement");
    }
  };

  // Function to handle achievement deletion
  const handleDeleteAchievement = async (achievementId) => {
    try {
      const response = await axios.delete(
        `http://localhost:6400/api/student/profile/achievement/${achievementId}`,
        { withCredentials: true }
      );

      if (response.data) {
        // Update achievements in studentInfo
        setStudentInfo((prevInfo) => ({
          ...prevInfo,
          achievements: response.data.achievements,
        }));
        console.log("Achievement deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting achievement:", error);
      alert("Failed to delete achievement");
    }
  };

  // Function to handle about section updates
  const handleUpdateAbout = async () => {
    try {
      const response = await axios.put(
        "http://localhost:6400/api/student/profile",
        { about: studentInfo.about },
        { withCredentials: true }
      );

      if (response.data) {
        setIsEditMode(false);
        console.log("About section updated successfully");
      }
    } catch (error) {
      console.error("Error updating about section:", error);
      alert("Failed to update about section");
    }
  };

  // Stats data
  const stats = [
    {
      title: "CGPA",
      value: studentInfo.cgpa,
      icon: ChartBar,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Semester",
      value: studentInfo.semester,
      icon: Calendar,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Projects",
      value: projects.length,
      icon: Briefcase,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Skills",
      value: studentInfo.skills.length,
      icon: Star,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  // Function to clear all notifications
  const clearAllNotifications = async () => {
    try {
      await axios.delete("http://localhost:6400/api/notifications/clear-all", {
        withCredentials: true,
      });

      // Update local state
      setNotifications([]);
      setUnreadCount(0); // Reset unread count when clearing all notifications
    } catch (error) {
      console.error("Error clearing all notifications:", error);
    }
  };

  // Function to handle education addition/update
  const handleSaveEducation = async (e) => {
    e.preventDefault();

    try {
      // Parse percentage and year as numbers explicitly
      const percentage = parseFloat(newEducation.percentage);
      const year = parseInt(newEducation.year);

      // Validate inputs
      if (isNaN(percentage) || isNaN(year)) {
        alert("Please enter valid numbers for percentage and year");
        return;
      }

      const educationData = {
        level: newEducation.level,
        school: newEducation.school,
        board: newEducation.board,
        percentage: percentage,
        year: year,
      };

      // If editing, include the ID
      if (selectedEducation && selectedEducation._id) {
        educationData.id = selectedEducation._id;
      }

      console.log("Sending education data:", educationData);

      const response = await axios.post(
        "http://localhost:6400/api/student/profile/education",
        educationData,
        { withCredentials: true }
      );

      if (response.data) {
        // Update local state from the response
        const eduObj = { ...education };

        // Create or update the education entry in our state object
        if (response.data.education && response.data.education.length > 0) {
          // Find the education entry we just added/updated
          const updatedEdu = response.data.education.find((edu) =>
            selectedEducation && selectedEducation._id
              ? edu._id === selectedEducation._id
              : edu.level === newEducation.level
          );

          if (updatedEdu) {
            eduObj[updatedEdu.level] = {
              school: updatedEdu.school,
              board: updatedEdu.board,
              percentage: updatedEdu.percentage,
              year: updatedEdu.year,
              _id: updatedEdu._id,
            };
          }
        }

        setEducation(eduObj);

        // Reset form and close modal
        setNewEducation({
          level: "",
          school: "",
          board: "",
          percentage: "",
          year: "",
        });
        setSelectedEducation(null);
        setIsEducationModalOpen(false);
        console.log("Education saved successfully");
      }
    } catch (error) {
      console.error("Error saving education:", error);
      let errorMessage = "Failed to save education details";

      if (error.response && error.response.data) {
        if (error.response.data.message) {
          errorMessage += ": " + error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage += ": " + error.response.data.error;
        }
      }

      alert(errorMessage);
    }
  };

  // Function to handle education deletion
  const handleDeleteEducation = async (educationId) => {
    try {
      const response = await axios.delete(
        `http://localhost:6400/api/student/profile/education/${educationId}`,
        { withCredentials: true }
      );

      if (response.data) {
        // Update local state by recreating the education object from the response
        const eduObj = {};
        if (response.data.education) {
          response.data.education.forEach((edu) => {
            eduObj[edu.level] = {
              school: edu.school,
              board: edu.board,
              percentage: edu.percentage,
              year: edu.year,
              _id: edu._id,
            };
          });
        }

        setEducation(eduObj);
        console.log("Education deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting education:", error);
      alert("Failed to delete education");
    }
  };

  // Function to handle project addition
  const handleAddProject = async (e) => {
    e.preventDefault();

    try {
      const projectData = {
        title: newProject.title,
        description: newProject.description,
        technologies: newProject.technologies
          .split(",")
          .map((tech) => tech.trim()),
        link: newProject.link,
      };

      const response = await axios.post(
        "http://localhost:6400/api/student/profile/project",
        projectData,
        { withCredentials: true }
      );

      if (response.data) {
        setProjects((prevProjects) => [...prevProjects, response.data]);
        setNewProject({
          title: "",
          description: "",
          technologies: "",
          link: "",
        });
        setIsProjectModalOpen(false);
        console.log("Project added successfully");
      }
    } catch (error) {
      console.error("Error adding project:", error);
      alert("Failed to add project");
    }
  };

  // Function to handle project update
  const handleUpdateProject = async (e) => {
    e.preventDefault();

    try {
      const projectData = {
        title: selectedProject.title,
        description: selectedProject.description,
        technologies: selectedProject.technologies
          .split(",")
          .map((tech) => tech.trim()),
        link: selectedProject.link,
      };

      const response = await axios.put(
        `http://localhost:6400/api/student/profile/project/${selectedProject._id}`,
        projectData,
        { withCredentials: true }
      );

      if (response.data) {
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project._id === selectedProject._id ? response.data : project
          )
        );
        setSelectedProject(null);
        setIsEditProjectModalOpen(false);
        console.log("Project updated successfully");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Failed to update project");
    }
  };

  // Function to handle project deletion
  const handleDeleteProject = async (projectId) => {
    try {
      const response = await axios.delete(
        `http://localhost:6400/api/student/profile/project/${projectId}`,
        { withCredentials: true }
      );

      if (response.data) {
        // Update local state by filtering out the deleted project
        setProjects(projects.filter((project) => project._id !== projectId));
        console.log("Project deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project");
    }
  };

  // Check available branches for troubleshooting
  const checkAvailableBranches = async () => {
    try {
      const response = await axios.get("http://localhost:6400/api/branches", {
        withCredentials: true,
      });

      console.log("Available branches:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching branches:", error);
      return null;
    }
  };

  // Find student in branch database
  const findStudentRecord = async (studentData) => {
    try {
      console.log("Searching for student record:", studentData);

      const response = await axios.post(
        "http://localhost:6400/api/student/find",
        studentData,
        { withCredentials: true }
      );

      console.log("Student record search result:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error searching for student record:", error);
      return null;
    }
  };

  // Helper function to try all possible branch endpoints
  const tryAllBranchEndpoints = async (data) => {
    const branches = ["cse", "ece", "it", "eee", "mech", "civil"]; // Common engineering branches
    const branchName = data.branch?.toLowerCase() || "";
    let lastError = null;

    console.log(
      "Attempting branch-specific updates with data:",
      JSON.stringify(data)
    );

    // First try specific branch if we know it
    if (branchName && branches.includes(branchName)) {
      try {
        console.log(`Trying ${branchName} specific endpoint...`);
        const response = await axios.put(
          `http://localhost:6400/api/student/${branchName}/update`,
          data,
          {
            withCredentials: true,
            timeout: 30000,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(`Success with ${branchName} branch:`, response.data);
        return response;
      } catch (err) {
        console.log(`${branchName} specific endpoint failed:`, err.message);
        lastError = err;
      }
    }

    // Try each branch endpoint in series
    const branchesToTry = branches.filter((branch) => branch !== branchName);

    console.log(
      `Attempting to find student in ${branchesToTry.length} branch databases...`
    );

    // Try endpoints one by one
    for (const branch of branchesToTry) {
      try {
        console.log(`Trying ${branch} branch endpoint...`);
        const response = await axios.put(
          `http://localhost:6400/api/student/${branch}/update`,
          data,
          {
            withCredentials: true,
            timeout: 30000,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(`Found student in ${branch} branch database!`);
        return response;
      } catch (err) {
        console.log(`${branch} branch endpoint failed:`, err.message);
        lastError = err;
      }
    }

    // If we've gone through all branches and none worked, throw the most recent error
    if (lastError) {
      throw lastError;
    }
    throw new Error("Could not find student record in any branch database");
  };

  // Direct branch database update function
  const directBranchUpdate = async (branchCode, studentData) => {
    try {
      console.log(
        `BRANCH UPDATE: Attempting update in ${branchCode} database with:`,
        studentData
      );

      const response = await axios.put(
        `http://localhost:6400/api/student/${branchCode}/update`,
        studentData,
        {
          withCredentials: true,
          timeout: 30000,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(
        `BRANCH SUCCESS: Updated in ${branchCode} database:`,
        response.data
      );
      return { success: true, response };
    } catch (error) {
      console.error(
        `BRANCH ERROR: Failed in ${branchCode} database:`,
        error.message
      );
      return { success: false, error };
    }
  };

  // Function to update contact information
  const handleUpdateContact = async () => {
    try {
      setUpdatingContact(true);

      // Validation
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(contactInfo.email)) {
        alert("Please enter a valid email address");
        setUpdatingContact(false);
        return;
      }

      const phoneRegex = /^\d{10,15}$/;
      if (!phoneRegex.test(contactInfo.phone)) {
        alert("Please enter a valid phone number (10-15 digits, numbers only)");
        setUpdatingContact(false);
        return;
      }

      // Get student identifiers
      const userId = currentUser?._id;
      const registrationNumber =
        currentUser?.registrationNumber || studentInfo.rollNo;
      const branch = currentUser?.branch || studentInfo.department;
      const name = currentUser?.name || studentInfo.name;

      if (!registrationNumber) {
        alert("Cannot identify student record without registration number.");
        setUpdatingContact(false);
        return;
      }

      // Prepare update data
      const updateData = {
        email: contactInfo.email,
        phone: contactInfo.phone,
        registrationNumber: registrationNumber,
        name: name,
        userId: userId,
      };

      console.log("UPDATE ATTEMPT - Student details:", {
        branch: branch || "Unknown branch",
        regNo: registrationNumber,
        name: name,
        userId: userId,
        requestData: updateData,
      });

      let updateSuccess = false;
      let updateResponse = null;

      // 1. Try specific branch if we know it
      if (branch) {
        const branchCode = branch.toLowerCase().replace(/\s+/g, "");
        console.log(`Trying known branch: ${branchCode}`);

        const result = await directBranchUpdate(branchCode, updateData);
        if (result.success) {
          updateSuccess = true;
          updateResponse = result.response;
        }
      }

      // 2. If that failed, try all common branches
      if (!updateSuccess) {
        const branches = ["cse", "it", "ece", "eee", "mech", "civil"];

        for (const branchCode of branches) {
          // Skip if this is the branch we already tried
          if (
            branch &&
            branchCode === branch.toLowerCase().replace(/\s+/g, "")
          ) {
            continue;
          }

          console.log(`Trying branch: ${branchCode}`);
          const result = await directBranchUpdate(branchCode, updateData);

          if (result.success) {
            updateSuccess = true;
            updateResponse = result.response;
            break;
          }
        }
      }

      // 3. If still not successful, try the generic endpoints
      if (!updateSuccess) {
        // Try the general profile update endpoint
        try {
          console.log("Trying generic profile update endpoint");
          const response = await axios.put(
            "http://localhost:6400/api/student/profile",
            updateData,
            {
              withCredentials: true,
              timeout: 30000,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          console.log("Profile update succeeded:", response.data);
          updateSuccess = true;
          updateResponse = response;
        } catch (error) {
          console.error("Generic profile update failed:", error.message);
        }
      }

      // 4. Final try with the contact-specific endpoint
      if (!updateSuccess) {
        try {
          console.log("Trying contact-specific endpoint");
          const response = await axios.put(
            "http://localhost:6400/api/student/update-contact",
            updateData,
            {
              withCredentials: true,
              timeout: 30000,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          console.log("Contact endpoint update succeeded:", response.data);
          updateSuccess = true;
          updateResponse = response;
        } catch (error) {
          console.error("Contact endpoint update failed:", error.message);
        }
      }

      // Handle the final result
      if (updateSuccess && updateResponse) {
        handleUpdateSuccess(updateResponse);
      } else {
        alert(
          "Failed to update contact information. The system couldn't locate your record in any branch database. Please contact an administrator."
        );
      }
    } catch (error) {
      console.error("Update contact error:", error);
      alert("An unexpected error occurred. Please try again later.");
    } finally {
      setUpdatingContact(false);
    }
  };

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [updatingContact, setUpdatingContact] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
  });

  // Reinitialize contactInfo when opening the contact modal
  useEffect(() => {
    if (isContactModalOpen) {
      setContactInfo({
        email: currentUser?.email || studentInfo.email || "",
        phone: currentUser?.phone || studentInfo.phone || "",
      });
    }
  }, [isContactModalOpen, currentUser, studentInfo]);

  // Helper function to handle successful update
  const handleUpdateSuccess = (response) => {
    if (response && response.data) {
      console.log("Update success - Response data:", response.data);

      // Extract the updated email and phone from the response
      const updatedEmail = response.data.email || contactInfo.email;
      const updatedPhone = response.data.phone || contactInfo.phone;

      console.log("Updating local state with:", {
        email: updatedEmail,
        phone: updatedPhone,
      });

      // Update both the local state and user context
      setStudentInfo((prevInfo) => ({
        ...prevInfo,
        email: updatedEmail,
        phone: updatedPhone,
      }));

      if (typeof updateUserContext === "function") {
        updateUserContext({
          ...currentUser,
          email: updatedEmail,
          phone: updatedPhone,
        });
      }

      setIsContactModalOpen(false);

      // Show success message
      alert(
        "Contact information updated successfully! Changes will be visible when you reload the page."
      );

      // Force a page refresh to ensure updated data is displayed
      window.location.reload();
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-gray-50 ml-72">
        <div className="max-w-7xl mx-auto p-6">
          {/* Enhanced Header with Stats */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Student Profile
                </h1>
                <p className="text-gray-500">
                  Manage your academic profile and achievements
                </p>
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
                  className="bg-blue-600 text-white hover:bg-blue-700 relative"
                  onClick={() => setNotificationsOpen(true)}
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats &&
                stats.map((stat, index) => (
                  <Card key={index}>
                    <CardContent className="p-4 flex pt-4 items-center space-x-4">
                      <div className={`p-3 rounded-lg ${stat.color}`}>
                        <stat.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          {stat.title}
                        </p>
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
                    <h2 className="text-xl font-semibold">
                      {studentInfo.name}
                    </h2>
                    <Badge variant="secondary" className="mt-2">
                      {studentInfo.rollNo}
                    </Badge>
                    <div className="mt-4 w-full space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Mail className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="text-sm">{studentInfo.email}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Phone className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="text-sm">{studentInfo.phone}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Building2 className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="text-sm">
                          {studentInfo.department}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => setIsContactModalOpen(true)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Contact Info
                      </Button>
                    </div>
                    <div className="mt-6 flex gap-2">
                      {studentInfo.links &&
                        Object.entries(studentInfo.links).map(
                          ([platform, url]) => (
                            <TooltipProvider key={platform}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                  >
                                    {platform === "linkedin" ? (
                                      <Linkedin className="h-5 w-5 text-blue-600" />
                                    ) : platform === "github" ? (
                                      <Github className="h-5 w-5 text-gray-700" />
                                    ) : (
                                      <Globe className="h-5 w-5 text-blue-600" />
                                    )}
                                  </a>
                                </TooltipTrigger>
                                <TooltipContent>{url}</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )
                        )}
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

                {/* Profile Tab */}
                <TabsContent value="profile">
                  <Card>
                    <CardHeader1 className="flex flex-row items-center justify-between">
                      <CardTitle>Personal Information</CardTitle>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditMode(!isEditMode)}
                      >
                        {isEditMode ? "Cancel" : "Edit"}
                        {!isEditMode && <Edit className="h-4 w-4 ml-2" />}
                      </Button>
                    </CardHeader1>
                    <CardContent className="space-y-6">
                      {/* About Me Section */}
                      <div>
                        <h3 className="text-lg font-medium mb-2">About Me</h3>
                        {isEditMode ? (
                          <div className="space-y-4">
                            <Textarea
                              value={studentInfo.about}
                              onChange={(e) =>
                                setStudentInfo({
                                  ...studentInfo,
                                  about: e.target.value,
                                })
                              }
                              placeholder="Write something about yourself..."
                              className="min-h-[120px]"
                            />
                            <Button onClick={handleUpdateAbout}>
                              Save About
                            </Button>
                          </div>
                        ) : (
                          <p className="text-gray-600">
                            {studentInfo.about ||
                              "No information provided. Click Edit to add details."}
                          </p>
                        )}
                      </div>

                      {/* Interests Section */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-medium">Interests</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsInterestModalOpen(true)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {studentInfo.interests &&
                          studentInfo.interests.length > 0 ? (
                            studentInfo.interests.map((interest, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="flex items-center gap-1 py-1.5"
                              >
                                {interest}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 p-0 hover:bg-transparent"
                                  onClick={() => handleDeleteInterest(index)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))
                          ) : (
                            <p className="text-gray-500 text-sm">
                              No interests added yet.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Achievements Section */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-medium">Achievements</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setNewAchievement({ title: "", date: "" });
                              setSelectedAchievement(null);
                              setIsAchievementModalOpen(true);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add
                          </Button>
                        </div>
                        {studentInfo.achievements &&
                        studentInfo.achievements.length > 0 ? (
                          <div className="space-y-3">
                            {studentInfo.achievements.map(
                              (achievement, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                                >
                                  <div>
                                    <h4 className="font-medium">
                                      {achievement.title}
                                    </h4>
                                    <p className="text-gray-500 text-sm">
                                      {achievement.date}
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        setSelectedAchievement(achievement);
                                        setNewAchievement({
                                          title: achievement.title,
                                          date: achievement.date,
                                        });
                                        setIsAchievementModalOpen(true);
                                      }}
                                    >
                                      <Edit className="h-4 w-4 text-blue-600" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        handleDeleteAchievement(achievement._id)
                                      }
                                    >
                                      <Trash2 className="h-4 w-4 text-red-600" />
                                    </Button>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">
                            No achievements added yet.
                          </p>
                        )}
                      </div>

                      {/* External Links Section */}
                      {isEditMode && (
                        <div>
                          <h3 className="text-lg font-medium mb-2">
                            External Links
                          </h3>
                          <div className="grid gap-3">
                            <div className="grid grid-cols-3 gap-2 items-center">
                              <span className="text-sm">LinkedIn:</span>
                              <Input
                                className="col-span-2"
                                value={studentInfo.links.linkedin}
                                onChange={(e) =>
                                  setStudentInfo({
                                    ...studentInfo,
                                    links: {
                                      ...studentInfo.links,
                                      linkedin: e.target.value,
                                    },
                                  })
                                }
                                placeholder="linkedin.com/in/username"
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-2 items-center">
                              <span className="text-sm">GitHub:</span>
                              <Input
                                className="col-span-2"
                                value={studentInfo.links.github}
                                onChange={(e) =>
                                  setStudentInfo({
                                    ...studentInfo,
                                    links: {
                                      ...studentInfo.links,
                                      github: e.target.value,
                                    },
                                  })
                                }
                                placeholder="github.com/username"
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-2 items-center">
                              <span className="text-sm">Portfolio:</span>
                              <Input
                                className="col-span-2"
                                value={studentInfo.links.portfolio}
                                onChange={(e) =>
                                  setStudentInfo({
                                    ...studentInfo,
                                    links: {
                                      ...studentInfo.links,
                                      portfolio: e.target.value,
                                    },
                                  })
                                }
                                placeholder="yourportfolio.com"
                              />
                            </div>
                            <Button
                              onClick={() => {
                                handleUpdateAbout();
                              }}
                              className="mt-2 justify-self-end"
                            >
                              Save Links
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Education Tab */}
                <TabsContent value="education">
                  <Card>
                    <CardHeader1 className="flex flex-row items-center justify-between">
                      <CardTitle>Education</CardTitle>
                      <Button
                        onClick={() => {
                          setNewEducation({
                            level: "",
                            school: "",
                            board: "",
                            percentage: "",
                            year: "",
                          });
                          setSelectedEducation(null);
                          setIsEducationModalOpen(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Education
                      </Button>
                    </CardHeader1>
                    <CardContent>
                      {loading ? (
                        <div className="flex justify-center py-8">
                          <p>Loading education data...</p>
                        </div>
                      ) : education && Object.keys(education).length > 0 ? (
                        <div className="space-y-6">
                          {Object.entries(education).map(([level, details]) => (
                            <div
                              key={level}
                              className="border rounded-lg bg-white overflow-hidden"
                            >
                              <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
                                <div>
                                  <h3 className="text-lg font-medium">
                                    {level}
                                  </h3>
                                  <p className="text-gray-600 text-sm">
                                    {details.year}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setSelectedEducation({
                                        _id: details._id,
                                        level: level,
                                        school: details.school,
                                        board: details.board,
                                        percentage: details.percentage,
                                        year: details.year,
                                      });
                                      setNewEducation({
                                        level: level,
                                        school: details.school,
                                        board: details.board,
                                        percentage: details.percentage,
                                        year: details.year,
                                      });
                                      setIsEducationModalOpen(true);
                                    }}
                                  >
                                    <Edit className="h-4 w-4 text-blue-600" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleDeleteEducation(details._id)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </Button>
                                </div>
                              </div>
                              <div className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Institution
                                    </p>
                                    <p className="font-medium">
                                      {details.school}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Board/University
                                    </p>
                                    <p className="font-medium">
                                      {details.board}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">
                                      Percentage/CGPA
                                    </p>
                                    <p className="font-medium">
                                      {details.percentage}%
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-gray-500">
                            No education details added yet.
                          </p>
                          <Button
                            className="mt-4"
                            onClick={() => {
                              setNewEducation({
                                level: "",
                                school: "",
                                board: "",
                                percentage: "",
                                year: "",
                              });
                              setIsEducationModalOpen(true);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Education Details
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Skills Tab */}
                <TabsContent value="skills">
                  <Card>
                    <CardHeader1 className="flex flex-row items-center justify-between">
                      <CardTitle>Skills & Certifications</CardTitle>
                      <Button
                        onClick={() => {
                          setNewSkill({
                            category: "programmingLanguages",
                            skill: "",
                          });
                          setNewCertification({
                            name: "",
                            issuer: "",
                            date: "",
                          });
                          setIsSkillModalOpen(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Skill
                      </Button>
                    </CardHeader1>
                    <CardContent>
                      {loading ? (
                        <div className="flex justify-center py-8">
                          <p>Loading skills data...</p>
                        </div>
                      ) : (
                        <div className="space-y-8">
                          {/* Programming Languages */}
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <h3 className="text-lg font-medium">
                                Programming Languages
                              </h3>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setNewSkill({
                                    category: "programmingLanguages",
                                    skill: "",
                                  });
                                  setIsSkillModalOpen(true);
                                }}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Add
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {technicalSkills.programmingLanguages &&
                              technicalSkills.programmingLanguages.length >
                                0 ? (
                                technicalSkills.programmingLanguages.map(
                                  (lang, index) => (
                                    <Badge
                                      key={index}
                                      variant="secondary"
                                      className="flex items-center gap-1 py-1.5"
                                    >
                                      {lang}
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 p-0 hover:bg-transparent"
                                        onClick={() =>
                                          handleDeleteSkill(
                                            "programmingLanguages",
                                            index
                                          )
                                        }
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </Badge>
                                  )
                                )
                              ) : (
                                <p className="text-gray-500 text-sm">
                                  No programming languages added yet.
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Technologies */}
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <h3 className="text-lg font-medium">
                                Technologies
                              </h3>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setNewSkill({
                                    category: "technologies",
                                    skill: "",
                                  });
                                  setIsSkillModalOpen(true);
                                }}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Add
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {technicalSkills.technologies &&
                              technicalSkills.technologies.length > 0 ? (
                                technicalSkills.technologies.map(
                                  (tech, index) => (
                                    <Badge
                                      key={index}
                                      variant="secondary"
                                      className="flex items-center gap-1 py-1.5"
                                    >
                                      {tech}
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 p-0 hover:bg-transparent"
                                        onClick={() =>
                                          handleDeleteSkill(
                                            "technologies",
                                            index
                                          )
                                        }
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </Badge>
                                  )
                                )
                              ) : (
                                <p className="text-gray-500 text-sm">
                                  No technologies added yet.
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Tools */}
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <h3 className="text-lg font-medium">Tools</h3>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setNewSkill({
                                    category: "tools",
                                    skill: "",
                                  });
                                  setIsSkillModalOpen(true);
                                }}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Add
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {technicalSkills.tools &&
                              technicalSkills.tools.length > 0 ? (
                                technicalSkills.tools.map((tool, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="flex items-center gap-1 py-1.5"
                                  >
                                    {tool}
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-4 w-4 p-0 hover:bg-transparent"
                                      onClick={() =>
                                        handleDeleteSkill("tools", index)
                                      }
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </Badge>
                                ))
                              ) : (
                                <p className="text-gray-500 text-sm">
                                  No tools added yet.
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Certifications */}
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <h3 className="text-lg font-medium">
                                Certifications
                              </h3>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setNewSkill({
                                    category: "certifications",
                                    skill: "",
                                  });
                                  setNewCertification({
                                    name: "",
                                    issuer: "",
                                    date: "",
                                  });
                                  setIsSkillModalOpen(true);
                                }}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Add
                              </Button>
                            </div>
                            {technicalSkills.certifications &&
                            technicalSkills.certifications.length > 0 ? (
                              <div className="space-y-3">
                                {technicalSkills.certifications.map(
                                  (cert, index) => (
                                    <div
                                      key={index}
                                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                                    >
                                      <div>
                                        <h4 className="font-medium">
                                          {cert.name}
                                        </h4>
                                        <p className="text-gray-500 text-sm">
                                          {cert.issuer} • {cert.date}
                                        </p>
                                      </div>
                                      <div className="flex gap-2">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => {
                                            setSelectedCertification({
                                              ...cert,
                                              index,
                                            });
                                            setIsEditCertificationModalOpen(
                                              true
                                            );
                                          }}
                                        >
                                          <Edit className="h-4 w-4 text-blue-600" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() =>
                                            handleDeleteSkill(
                                              "certifications",
                                              index
                                            )
                                          }
                                        >
                                          <Trash2 className="h-4 w-4 text-red-600" />
                                        </Button>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            ) : (
                              <p className="text-gray-500 text-sm">
                                No certifications added yet.
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Projects Tab */}
                <TabsContent value="projects">
                  <Card>
                    <CardHeader1 className="flex flex-row items-center justify-between">
                      <CardTitle>Projects</CardTitle>
                      <Button
                        onClick={() => {
                          setNewProject({
                            title: "",
                            description: "",
                            technologies: "",
                            link: "",
                          });
                          setIsProjectModalOpen(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Project
                      </Button>
                    </CardHeader1>
                    <CardContent>
                      {loading ? (
                        <div className="flex justify-center py-8">
                          <p>Loading project data...</p>
                        </div>
                      ) : projects && projects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {projects.map((project) => (
                            <div
                              key={project._id}
                              className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow"
                            >
                              <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-lg">
                                  {project.title}
                                </h3>
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
                                    onClick={() =>
                                      handleDeleteProject(project._id)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </Button>
                                </div>
                              </div>
                              <p className="text-gray-600 mt-2">
                                {project.description}
                              </p>
                              <div className="flex flex-wrap gap-2 mt-3">
                                {project.technologies &&
                                  project.technologies.map((tech, index) => (
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
                      ) : (
                        <div className="text-center py-8 col-span-2">
                          <p className="text-gray-500">
                            No projects added yet.
                          </p>
                          <Button
                            className="mt-4"
                            onClick={() => setIsProjectModalOpen(true)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Your First Project
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Modals go here */}
      {/* Project Modal */}
      <Dialog open={isProjectModalOpen} onOpenChange={setIsProjectModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
            <DialogDescription>
              Add details about your project here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddProject}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Project Title
                </label>
                <Input
                  id="title"
                  value={newProject.title}
                  onChange={(e) =>
                    setNewProject({ ...newProject, title: e.target.value })
                  }
                  placeholder="Enter project title"
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe your project"
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="technologies" className="text-sm font-medium">
                  Technologies
                </label>
                <Input
                  id="technologies"
                  value={newProject.technologies}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      technologies: e.target.value,
                    })
                  }
                  placeholder="React, Node.js, MongoDB (comma separated)"
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="link" className="text-sm font-medium">
                  Project Link (optional)
                </label>
                <Input
                  id="link"
                  value={newProject.link}
                  onChange={(e) =>
                    setNewProject({ ...newProject, link: e.target.value })
                  }
                  placeholder="https://github.com/yourusername/project"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">Save Project</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Project Modal */}
      <Dialog
        open={isEditProjectModalOpen}
        onOpenChange={setIsEditProjectModalOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Make changes to your project details.
            </DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <form onSubmit={handleUpdateProject}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="edit-title" className="text-sm font-medium">
                    Project Title
                  </label>
                  <Input
                    id="edit-title"
                    value={selectedProject.title}
                    onChange={(e) =>
                      setSelectedProject({
                        ...selectedProject,
                        title: e.target.value,
                      })
                    }
                    placeholder="Enter project title"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <label
                    htmlFor="edit-description"
                    className="text-sm font-medium"
                  >
                    Description
                  </label>
                  <Textarea
                    id="edit-description"
                    value={selectedProject.description}
                    onChange={(e) =>
                      setSelectedProject({
                        ...selectedProject,
                        description: e.target.value,
                      })
                    }
                    placeholder="Describe your project"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <label
                    htmlFor="edit-technologies"
                    className="text-sm font-medium"
                  >
                    Technologies
                  </label>
                  <Input
                    id="edit-technologies"
                    value={
                      Array.isArray(selectedProject.technologies)
                        ? selectedProject.technologies.join(", ")
                        : selectedProject.technologies
                    }
                    onChange={(e) =>
                      setSelectedProject({
                        ...selectedProject,
                        technologies: e.target.value,
                      })
                    }
                    placeholder="React, Node.js, MongoDB (comma separated)"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="edit-link" className="text-sm font-medium">
                    Project Link (optional)
                  </label>
                  <Input
                    id="edit-link"
                    value={selectedProject.link}
                    onChange={(e) =>
                      setSelectedProject({
                        ...selectedProject,
                        link: e.target.value,
                      })
                    }
                    placeholder="https://github.com/yourusername/project"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit">Update Project</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Skills Modal */}
      <Dialog open={isSkillModalOpen} onOpenChange={setIsSkillModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Skill</DialogTitle>
            <DialogDescription>
              Add a new skill or certification to your profile.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSkill}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="skill-category" className="text-sm font-medium">
                  Category
                </label>
                <select
                  id="skill-category"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newSkill.category}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, category: e.target.value })
                  }
                  required
                >
                  <option value="programmingLanguages">
                    Programming Languages
                  </option>
                  <option value="technologies">Technologies</option>
                  <option value="tools">Tools</option>
                  <option value="certifications">Certifications</option>
                </select>
              </div>

              {newSkill.category !== "certifications" ? (
                <div className="grid gap-2">
                  <label htmlFor="skill-name" className="text-sm font-medium">
                    Skill
                  </label>
                  <Input
                    id="skill-name"
                    value={newSkill.skill}
                    onChange={(e) =>
                      setNewSkill({ ...newSkill, skill: e.target.value })
                    }
                    placeholder="Enter skill name"
                    required
                  />
                </div>
              ) : (
                <>
                  <div className="grid gap-2">
                    <label htmlFor="cert-name" className="text-sm font-medium">
                      Certification Name
                    </label>
                    <Input
                      id="cert-name"
                      value={newCertification.name}
                      onChange={(e) =>
                        setNewCertification({
                          ...newCertification,
                          name: e.target.value,
                        })
                      }
                      placeholder="AWS Certified Solutions Architect"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <label
                      htmlFor="cert-issuer"
                      className="text-sm font-medium"
                    >
                      Issuing Organization
                    </label>
                    <Input
                      id="cert-issuer"
                      value={newCertification.issuer}
                      onChange={(e) =>
                        setNewCertification({
                          ...newCertification,
                          issuer: e.target.value,
                        })
                      }
                      placeholder="Amazon Web Services"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="cert-date" className="text-sm font-medium">
                      Date Acquired
                    </label>
                    <Input
                      id="cert-date"
                      type="month"
                      value={newCertification.date}
                      onChange={(e) =>
                        setNewCertification({
                          ...newCertification,
                          date: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end">
              <Button type="submit">
                {newSkill.category === "certifications"
                  ? "Add Certification"
                  : "Add Skill"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Certification Modal */}
      <Dialog
        open={isEditCertificationModalOpen}
        onOpenChange={setIsEditCertificationModalOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Certification</DialogTitle>
            <DialogDescription>
              Make changes to your certification details.
            </DialogDescription>
          </DialogHeader>
          {selectedCertification && (
            <form onSubmit={handleUpdateCertification}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label
                    htmlFor="edit-cert-name"
                    className="text-sm font-medium"
                  >
                    Certification Name
                  </label>
                  <Input
                    id="edit-cert-name"
                    value={selectedCertification.name}
                    onChange={(e) =>
                      setSelectedCertification({
                        ...selectedCertification,
                        name: e.target.value,
                      })
                    }
                    placeholder="AWS Certified Solutions Architect"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <label
                    htmlFor="edit-cert-issuer"
                    className="text-sm font-medium"
                  >
                    Issuing Organization
                  </label>
                  <Input
                    id="edit-cert-issuer"
                    value={selectedCertification.issuer}
                    onChange={(e) =>
                      setSelectedCertification({
                        ...selectedCertification,
                        issuer: e.target.value,
                      })
                    }
                    placeholder="Amazon Web Services"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <label
                    htmlFor="edit-cert-date"
                    className="text-sm font-medium"
                  >
                    Date Acquired
                  </label>
                  <Input
                    id="edit-cert-date"
                    type="month"
                    value={selectedCertification.date}
                    onChange={(e) =>
                      setSelectedCertification({
                        ...selectedCertification,
                        date: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit">Update Certification</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Education Modal */}
      <Dialog
        open={isEducationModalOpen}
        onOpenChange={setIsEducationModalOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedEducation ? "Edit Education" : "Add Education"}
            </DialogTitle>
            <DialogDescription>
              {selectedEducation
                ? "Update your education details."
                : "Add your educational background."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveEducation}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="edu-level" className="text-sm font-medium">
                  Education Level
                </label>
                <select
                  id="edu-level"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={newEducation.level}
                  onChange={(e) =>
                    setNewEducation({ ...newEducation, level: e.target.value })
                  }
                  required
                  disabled={!!selectedEducation}
                >
                  <option value="">Select a level</option>
                  <option value="ssc">
                    SSC (Secondary School Certificate)
                  </option>
                  <option value="hsc">
                    HSC (Higher Secondary Certificate)
                  </option>
                  <option value="graduation">Graduation</option>
                  <option value="postgraduation">Post Graduation</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label htmlFor="edu-school" className="text-sm font-medium">
                  Institution/School
                </label>
                <Input
                  id="edu-school"
                  value={newEducation.school}
                  onChange={(e) =>
                    setNewEducation({ ...newEducation, school: e.target.value })
                  }
                  placeholder="University name or school name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="edu-board" className="text-sm font-medium">
                  Board/University
                </label>
                <Input
                  id="edu-board"
                  value={newEducation.board}
                  onChange={(e) =>
                    setNewEducation({ ...newEducation, board: e.target.value })
                  }
                  placeholder="Board or university name"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label
                    htmlFor="edu-percentage"
                    className="text-sm font-medium"
                  >
                    Percentage/CGPA
                  </label>
                  <Input
                    id="edu-percentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={newEducation.percentage}
                    onChange={(e) =>
                      setNewEducation({
                        ...newEducation,
                        percentage: e.target.value,
                      })
                    }
                    placeholder="85.5"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="edu-year" className="text-sm font-medium">
                    Year of Completion
                  </label>
                  <Input
                    id="edu-year"
                    type="number"
                    min="1900"
                    max="2100"
                    value={newEducation.year}
                    onChange={(e) =>
                      setNewEducation({ ...newEducation, year: e.target.value })
                    }
                    placeholder="2023"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">
                {selectedEducation ? "Update" : "Save"} Education
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Achievement Modal */}
      <Dialog
        open={isAchievementModalOpen}
        onOpenChange={setIsAchievementModalOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedAchievement ? "Edit Achievement" : "Add Achievement"}
            </DialogTitle>
            <DialogDescription>
              {selectedAchievement
                ? "Update your achievement details."
                : "Add a new achievement to your profile."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveAchievement}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label
                  htmlFor="achievement-title"
                  className="text-sm font-medium"
                >
                  Achievement Title
                </label>
                <Input
                  id="achievement-title"
                  value={newAchievement.title}
                  onChange={(e) =>
                    setNewAchievement({
                      ...newAchievement,
                      title: e.target.value,
                    })
                  }
                  placeholder="First Prize - Hackathon 2023"
                  required
                />
              </div>
              <div className="grid gap-2">
                <label
                  htmlFor="achievement-date"
                  className="text-sm font-medium"
                >
                  Date
                </label>
                <Input
                  id="achievement-date"
                  type="month"
                  value={newAchievement.date}
                  onChange={(e) =>
                    setNewAchievement({
                      ...newAchievement,
                      date: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">
                {selectedAchievement ? "Update" : "Save"} Achievement
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Interest Modal */}
      <Dialog open={isInterestModalOpen} onOpenChange={setIsInterestModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Interest</DialogTitle>
            <DialogDescription>
              Add a new area of interest to your profile.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="interest" className="text-sm font-medium">
                Interest
              </label>
              <Input
                id="interest"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="e.g. Machine Learning, Blockchain, etc."
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleAddInterest}>Add Interest</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Photo Modal */}
      <Dialog open={isPhotoModalOpen} onOpenChange={setIsPhotoModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Profile Photo</DialogTitle>
            <DialogDescription>Upload a new profile photo.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="profile-photo" className="text-sm font-medium">
                Photo
              </label>
              <Input id="profile-photo" type="file" accept="image/*" />
            </div>
          </div>
          <div className="flex justify-end">
            <Button>Upload Photo</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notifications Modal */}
      <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden">
          <DialogHeader className="pb-3 border-b">
            <div className="flex flex-row items-center justify-between">
              <div>
                <DialogTitle className="text-xl">Notifications</DialogTitle>
                <DialogDescription className="mt-1">
                  {unreadCount > 0
                    ? `You have ${unreadCount} unread notification${
                        unreadCount !== 1 ? "s" : ""
                      }`
                    : "No new notifications"}
                </DialogDescription>
              </div>
              <div className="flex space-x-2">
                {unreadCount > 0 && (
                  <Button variant="outline" size="sm" onClick={markAllAsRead}>
                    Mark all as read
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllNotifications}
                >
                  Clear all
                </Button>
              </div>
            </div>
          </DialogHeader>
          <div className="py-2">
            <div className="flex flex-col space-y-3 mb-4">
              <Input
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="all" className="text-xs sm:text-sm">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="alert" className="text-xs sm:text-sm">
                    Alerts
                  </TabsTrigger>
                  <TabsTrigger value="message" className="text-xs sm:text-sm">
                    Messages
                  </TabsTrigger>
                  <TabsTrigger value="update" className="text-xs sm:text-sm">
                    Updates
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <ScrollArea className="h-[350px] pr-4">
              {notificationsLoading ? (
                <div className="flex justify-center py-8">
                  <p>Loading notifications...</p>
                </div>
              ) : filteredNotifications && filteredNotifications.length > 0 ? (
                <div className="space-y-3">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`p-4 rounded-lg flex items-start mb-2 ${
                        notification.status === "unread"
                          ? "bg-blue-50"
                          : "bg-gray-50"
                      } border ${
                        notification.status === "unread"
                          ? "border-blue-100"
                          : "border-gray-200"
                      }`}
                    >
                      <div className={`p-2 rounded-full mr-3 flex-shrink-0`}>
                        {notification.type === "alert" ? (
                          <Bell className="h-5 w-5 text-red-500" />
                        ) : notification.type === "message" ? (
                          <Mail className="h-5 w-5 text-blue-500" />
                        ) : (
                          <Info className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-medium text-sm line-clamp-1">
                            {notification.title}
                          </h4>
                          <div className="flex items-center space-x-1 flex-shrink-0 whitespace-nowrap">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="text-xs text-gray-500 cursor-help">
                                    {formatDate(notification.timestamp)}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {notification.timestamp &&
                                    !isNaN(
                                      new Date(notification.timestamp).getTime()
                                    )
                                      ? new Date(
                                          notification.timestamp
                                        ).toLocaleString(undefined, {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                          hour: "numeric",
                                          minute: "numeric",
                                          second: "numeric",
                                        })
                                      : "Invalid date"}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() =>
                                removeNotification(notification._id)
                              }
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 break-words max-h-[80px] overflow-y-auto">
                          {notification.message}
                        </p>
                        {notification.status === "unread" && (
                          <Button
                            variant="link"
                            size="sm"
                            className="mt-2 p-0 h-auto text-xs"
                            onClick={() => markAsRead(notification._id)}
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No notifications found</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Info Modal */}
      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Contact Information</DialogTitle>
            <DialogDescription>
              Update your email address and phone number.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={contactInfo.email}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, email: e.target.value })
                }
                placeholder="your.email@example.com"
                required
                disabled={updatingContact}
              />
              <p className="text-xs text-gray-500">
                This email will be used for all communications.
              </p>
            </div>
            <div className="grid gap-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </label>
              <Input
                id="phone"
                type="tel"
                value={contactInfo.phone}
                onChange={(e) => {
                  // Only allow numbers in phone field
                  const value = e.target.value.replace(/\D/g, "");
                  setContactInfo({ ...contactInfo, phone: value });
                }}
                placeholder="1234567890"
                required
                disabled={updatingContact}
                maxLength={15}
              />
              <p className="text-xs text-gray-500">
                Enter a valid phone number (10-15 digits, numbers only).
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsContactModalOpen(false)}
              disabled={updatingContact}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateContact}
              disabled={updatingContact}
              className={updatingContact ? "bg-blue-600" : ""}
            >
              {updatingContact ? (
                <>
                  <span className="mr-2 animate-spin">&#9696;</span>
                  Updating...
                </>
              ) : (
                "Update Contact Info"
              )}
            </Button>
          </div>
          {updatingContact && (
            <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-sm rounded-md">
              <h4 className="font-semibold mb-1">
                Looking for your student record...
              </h4>
              <p className="text-xs">
                This may take a moment as we search through branch databases.
              </p>
              <div className="mt-2 h-1 bg-blue-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 animate-pulse"></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
