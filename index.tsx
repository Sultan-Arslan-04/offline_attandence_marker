import { useState, useEffect } from 'react'
import { Calendar, Check, User, Plus, Trash, Edit, ChevronDown, ChevronUp, Clock, Users, Home, BookOpen, BarChart2, Settings } from 'lucide-react'
import { Button } from "/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "/components/ui/card"
import { Input } from "/components/ui/input"
import { Label } from "/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "/components/ui/tabs"
import { Badge } from "/components/ui/badge"
import { Progress } from "/components/ui/progress"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "/components/ui/select"
import { motion } from "framer-motion"

type Student = {
  id: string
  name: string
  rollNumber?: string
  className?: string
}

type AttendanceRecord = {
  date: string
  presentStudents: string[]
}

type Class = {
  id: string
  name: string
}

export default function AttendanceApp() {
  const [students, setStudents] = useState<Student[]>([])
  const [newStudent, setNewStudent] = useState<Omit<Student, 'id'>>({ name: '', rollNumber: '', className: '' })
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0])
  const [activeTab, setActiveTab] = useState<'mark' | 'view' | 'manage' | 'stats'>('mark')
  const [selectedViewDate, setSelectedViewDate] = useState(currentDate)
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null)
  const [editStudent, setEditStudent] = useState<Student>({ id: '', name: '', rollNumber: '', className: '' })
  const [classes, setClasses] = useState<Class[]>([])
  const [newClassName, setNewClassName] = useState('')
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null)

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedStudents = localStorage.getItem('attendance-students')
    const savedRecords = localStorage.getItem('attendance-records')
    const savedClasses = localStorage.getItem('attendance-classes')

    if (savedStudents) setStudents(JSON.parse(savedStudents))
    if (savedRecords) setAttendanceRecords(JSON.parse(savedRecords))
    if (savedClasses) setClasses(JSON.parse(savedClasses))
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('attendance-students', JSON.stringify(students))
  }, [students])

  useEffect(() => {
    localStorage.setItem('attendance-records', JSON.stringify(attendanceRecords))
  }, [attendanceRecords])

  useEffect(() => {
    localStorage.setItem('attendance-classes', JSON.stringify(classes))
  }, [classes])

  const addStudent = () => {
    if (!newStudent.name.trim()) return
    
    const student: Student = {
      id: Date.now().toString(),
      ...newStudent
    }
    
    setStudents([...students, student])
    setNewStudent({ name: '', rollNumber: '', className: '' })
  }

  const deleteStudent = (id: string) => {
    setStudents(students.filter(student => student.id !== id))
  }

  const startEditing = (student: Student) => {
    setEditingStudentId(student.id)
    setEditStudent(student)
  }

  const saveEdit = () => {
    if (!editingStudentId || !editStudent.name.trim()) return
    
    setStudents(students.map(student => 
      student.id === editingStudentId 
        ? { ...editStudent } 
        : student
    ))
    setEditingStudentId(null)
  }

  const markAttendance = () => {
    const presentStudents = students
      .filter(student => {
        const checkbox = document.getElementById(`student-${student.id}`) as HTMLInputElement
        return checkbox?.checked
      })
      .map(student => student.id)

    const existingRecordIndex = attendanceRecords.findIndex(record => record.date === currentDate)

    if (existingRecordIndex >= 0) {
      // Update existing record
      const updatedRecords = [...attendanceRecords]
      updatedRecords[existingRecordIndex] = { date: currentDate, presentStudents }
      setAttendanceRecords(updatedRecords)
    } else {
      // Add new record
      setAttendanceRecords([...attendanceRecords, { date: currentDate, presentStudents }])
    }

    // Show success feedback
    const saveBtn = document.getElementById('save-attendance-btn')
    if (saveBtn) {
      saveBtn.textContent = 'Saved!'
      setTimeout(() => {
        saveBtn.textContent = 'Save Attendance'
      }, 2000)
    }
  }

  const getAttendanceForDate = (date: string) => {
    const record = attendanceRecords.find(r => r.date === date)
    return record ? record.presentStudents : []
  }

  const addClass = () => {
    if (!newClassName.trim()) return
    
    const newClass = {
      id: Date.now().toString(),
      name: newClassName.trim()
    }
    
    setClasses([...classes, newClass])
    setNewClassName('')
  }

  const deleteClass = (id: string) => {
    setClasses(classes.filter(c => c.id !== id))
    // Remove class reference from students
    setStudents(students.map(s => s.className === id ? {...s, className: ''} : s))
  }

  const getAttendanceStats = () => {
    const stats: Record<string, { present: number; total: number }> = {}

    students.forEach(student => {
      if (!stats[student.className || 'Unassigned']) {
        stats[student.className || 'Unassigned'] = { present: 0, total: 0 }
      }
      stats[student.className || 'Unassigned'].total++
    })

    attendanceRecords.forEach(record => {
      record.presentStudents.forEach(studentId => {
        const student = students.find(s => s.id === studentId)
        if (student) {
          const className = student.className || 'Unassigned'
          stats[className].present++
        }
      })
    })

    return stats
  }

  const getStudentAttendancePercentage = (studentId: string) => {
    if (attendanceRecords.length === 0) return 0
    const presentDays = attendanceRecords.filter(record => 
      record.presentStudents.includes(studentId)
    ).length
    return Math.round((presentDays / attendanceRecords.length) * 100)
  }

  const toggleExpandStudent = (studentId: string) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <Card className="shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6" />
                <CardTitle className="text-2xl font-bold">ClassTrack</CardTitle>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </CardHeader>

          <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-100">
              <TabsTrigger value="mark" className="flex items-center gap-2">
                <Check className="h-4 w-4" />
                <span>Mark</span>
              </TabsTrigger>
              <TabsTrigger value="view" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>View</span>
              </TabsTrigger>
              <TabsTrigger value="stats" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                <span>Stats</span>
              </TabsTrigger>
              <TabsTrigger value="manage" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Manage</span>
              </TabsTrigger>
            </TabsList>

            <CardContent className="p-6">
              <TabsContent value="mark">
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                    <div className="flex-1">
                      <Label htmlFor="date" className="text-sm font-medium text-gray-700">Date</Label>
                      <Input
                        type="date"
                        id="date"
                        value={currentDate}
                        onChange={(e) => setCurrentDate(e.target.value)}
                        className="w-full sm:w-48"
                      />
                    </div>
                    <div className="flex-1 w-full">
                      <Label htmlFor="class-filter" className="text-sm font-medium text-gray-700">Filter by Class</Label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="All Classes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Classes</SelectItem>
                          {classes.map(c => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <div className="p-4 border-b bg-gray-50">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        <span>Mark Attendance for {currentDate}</span>
                      </h3>
                    </div>
                    
                    {students.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <p>No students added yet. Go to "Manage" to add students.</p>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {students.map(student => (
                          <div key={student.id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  id={`student-${student.id}`}
                                  defaultChecked={getAttendanceForDate(currentDate).includes(student.id)}
                                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <div>
                                  <Label htmlFor={`student-${student.id}`} className="font-medium">
                                    {student.name}
                                  </Label>
                                  <div className="text-sm text-gray-500">
                                    {student.rollNumber && `#${student.rollNumber}`} 
                                    {student.className && classes.find(c => c.id === student.className) && (
                                      <Badge variant="outline" className="ml-2">
                                        {classes.find(c => c.id === student.className)?.name}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => toggleExpandStudent(student.id)}
                              >
                                {expandedStudent === student.id ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </div>

                            {expandedStudent === student.id && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-3 pl-8"
                              >
                                <div className="text-sm text-gray-600">
                                  <p>Attendance: {getStudentAttendancePercentage(student.id)}%</p>
                                  <Progress 
                                    value={getStudentAttendancePercentage(student.id)} 
                                    className="h-2 mt-1" 
                                  />
                                </div>
                              </motion.div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="view">
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                    <div className="flex-1">
                      <Label htmlFor="view-date" className="text-sm font-medium text-gray-700">Select Date</Label>
                      <Input
                        type="date"
                        id="view-date"
                        value={selectedViewDate}
                        onChange={(e) => setSelectedViewDate(e.target.value)}
                        className="w-full sm:w-48"
                      />
                    </div>
                    <div className="flex-1 w-full">
                      <Label htmlFor="view-class-filter" className="text-sm font-medium text-gray-700">Filter by Class</Label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="All Classes" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Classes</SelectItem>
                          {classes.map(c => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <div className="p-4 border-b bg-gray-50">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <span>Attendance for {selectedViewDate}</span>
                      </h3>
                    </div>
                    
                    {students.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <p>No students added yet.</p>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {students.map(student => (
                          <div key={student.id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {getAttendanceForDate(selectedViewDate).includes(student.id) ? (
                                  <Check className="h-5 w-5 text-green-600" />
                                ) : (
                                  <span className="h-5 w-5 text-red-500">✕</span>
                                )}
                                <div>
                                  <span className="font-medium">
                                    {student.name}
                                  </span>
                                  <div className="text-sm text-gray-500">
                                    {student.rollNumber && `#${student.rollNumber}`} 
                                    {student.className && classes.find(c => c.id === student.className) && (
                                      <Badge variant="outline" className="ml-2">
                                        {classes.find(c => c.id === student.className)?.name}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <span className={`text-sm ${getAttendanceForDate(selectedViewDate).includes(student.id) ? 'text-green-600' : 'text-red-600'}`}>
                                {getAttendanceForDate(selectedViewDate).includes(student.id) ? 'Present' : 'Absent'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="stats">
                <div className="space-y-6">
                  <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <div className="p-4 border-b bg-gray-50">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <BarChart2 className="h-5 w-5 text-blue-600" />
                        <span>Attendance Statistics</span>
                      </h3>
                    </div>
                    
                    <div className="p-6">
                      <h4 className="font-medium mb-4">Overall Attendance</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(getAttendanceStats()).map(([className, stats]) => (
                          <Card key={className} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-medium text-gray-700">
                                {className}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-2xl font-bold">
                                  {stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}%
                                </span>
                                <span className="text-sm text-gray-500">
                                  {stats.present}/{stats.total} students
                                </span>
                              </div>
                              <Progress 
                                value={stats.total > 0 ? (stats.present / stats.total) * 100 : 0} 
                                className="h-2" 
                              />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <div className="p-4 border-b bg-gray-50">
                      <h4 className="font-medium flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        <span>Student Performance</span>
                      </h4>
                    </div>
                    
                    {students.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">
                        <p>No students added yet.</p>
                      </div>
                    ) : (
                      <div className="divide-y">
                        {students.map(student => (
                          <div key={student.id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">{student.name}</div>
                                <div className="text-sm text-gray-500">
                                  {student.rollNumber && `#${student.rollNumber}`} 
                                  {student.className && classes.find(c => c.id === student.className) && (
                                    <Badge variant="outline" className="ml-2">
                                      {classes.find(c => c.id === student.className)?.name}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium">
                                  {getStudentAttendancePercentage(student.id)}%
                                </div>
                                <div className="text-xs text-gray-500">
                                  {attendanceRecords.filter(r => r.presentStudents.includes(student.id)).length} days
                                </div>
                              </div>
                            </div>
                            <Progress 
                              value={getStudentAttendancePercentage(student.id)} 
                              className="h-2 mt-2" 
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="manage">
                <div className="space-y-6">
                  <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <div className="p-4 border-b bg-gray-50">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-600" />
                        <span>Manage Students</span>
                      </h3>
                    </div>
                    
                    <div className="p-6 space-y-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Add New Student</h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                          <div className="md:col-span-1">
                            <Label htmlFor="student-name" className="text-sm">Name</Label>
                            <Input
                              id="student-name"
                              placeholder="Full name"
                              value={newStudent.name}
                              onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                              onKeyDown={(e) => e.key === 'Enter' && addStudent()}
                            />
                          </div>
                          <div>
                            <Label htmlFor="student-roll" className="text-sm">Roll No.</Label>
                            <Input
                              id="student-roll"
                              placeholder="Roll number"
                              value={newStudent.rollNumber || ''}
                              onChange={(e) => setNewStudent({...newStudent, rollNumber: e.target.value})}
                              onKeyDown={(e) => e.key === 'Enter' && addStudent()}
                            />
                          </div>
                          <div>
                            <Label htmlFor="student-class" className="text-sm">Class</Label>
                            <Select
                              value={newStudent.className || ''}
                              onValueChange={(val) => setNewStudent({...newStudent, className: val})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select class" />
                              </SelectTrigger>
                              <SelectContent>
                                {classes.map(c => (
                                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-end">
                            <Button onClick={addStudent} className="w-full">
                              <Plus className="h-4 w-4 mr-1" />
                              Add Student
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium">All Students ({students.length})</h4>
                        
                        {students.length === 0 ? (
                          <p className="text-gray-500">No students added yet.</p>
                        ) : (
                          <div className="border rounded-lg divide-y overflow-hidden">
                            {students.map(student => (
                              <div key={student.id} className="p-4 hover:bg-gray-50 transition-colors">
                                {editingStudentId === student.id ? (
                                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                    <div className="md:col-span-1">
                                      <Input
                                        value={editStudent.name}
                                        onChange={(e) => setEditStudent({...editStudent, name: e.target.value})}
                                        onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                                      />
                                    </div>
                                    <div>
                                      <Input
                                        value={editStudent.rollNumber || ''}
                                        onChange={(e) => setEditStudent({...editStudent, rollNumber: e.target.value})}
                                        onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                                      />
                                    </div>
                                    <div>
                                      <Select
                                        value={editStudent.className || ''}
                                        onValueChange={(val) => setEditStudent({...editStudent, className: val})}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select class" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {classes.map(c => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button variant="outline" size="sm" onClick={saveEdit}>
                                        Save
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => setEditingStudentId(null)}
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="font-medium">{student.name}</div>
                                      <div className="text-sm text-gray-500">
                                        {student.rollNumber && `#${student.rollNumber}`} 
                                        {student.className && classes.find(c => c.id === student.className) && (
                                          <Badge variant="outline" className="ml-2">
                                            {classes.find(c => c.id === student.className)?.name}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => startEditing(student)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => deleteStudent(student.id)}
                                      >
                                        <Trash className="h-4 w-4 text-red-500" />
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <div className="p-4 border-b bg-gray-50">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <Home className="h-5 w-5 text-blue-600" />
                        <span>Manage Classes</span>
                      </h3>
                    </div>
                    
                    <div className="p-6 space-y-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Add New Class</h4>
                        <div className="flex gap-3">
                          <Input
                            placeholder="Class name"
                            value={newClassName}
                            onChange={(e) => setNewClassName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addClass()}
                            className="flex-1"
                          />
                          <Button onClick={addClass}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add Class
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium">All Classes ({classes.length})</h4>
                        
                        {classes.length === 0 ? (
                          <p className="text-gray-500">No classes added yet.</p>
                        ) : (
                          <div className="border rounded-lg divide-y overflow-hidden">
                            {classes.map(cls => (
                              <div key={cls.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                                <div className="font-medium">{cls.name}</div>
                                <div className="text-sm text-gray-500">
                                  {students.filter(s => s.className === cls.id).length} students
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => deleteClass(cls.id)}
                                >
                                  <Trash className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </CardContent>

            {activeTab === 'mark' && students.length > 0 && (
              <CardFooter className="border-t p-4 bg-gray-50 flex justify-end">
                <Button 
                  id="save-attendance-btn"
                  onClick={markAttendance}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Save Attendance
                </Button>
              </CardFooter>
            )}
          </Tabs>
        </Card>
      </motion.div>
    </div>
  )
}
