"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ChatSidebar from "@/components/chat-sidebar"
import { ArrowLeft, Save, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const router = useRouter()
  const [name, setName] = useState("Usuário")
  const [email, setEmail] = useState("usuario@exemplo.com")
  const [language, setLanguage] = useState("pt-BR")
  const [theme, setTheme] = useState("light")
  const [notifications, setNotifications] = useState(true)
  const [soundEffects, setSoundEffects] = useState(true)
  const [apiKey, setApiKey] = useState("")
  const [model, setModel] = useState("gpt-4")
  const [temperature, setTemperature] = useState("0.7")
  const [maxTokens, setMaxTokens] = useState("2048")
  const [saveStatus, setSaveStatus] = useState("") // Para mensagens de status

  // Carregar configurações salvas quando a página for carregada
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings')
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        if (settings.name) setName(settings.name)
        if (settings.email) setEmail(settings.email)
        if (settings.language) setLanguage(settings.language)
        if (settings.theme) setTheme(settings.theme)
        if (settings.notifications !== undefined) setNotifications(settings.notifications)
        if (settings.soundEffects !== undefined) setSoundEffects(settings.soundEffects)
        if (settings.apiKey) setApiKey(settings.apiKey)
        if (settings.model) setModel(settings.model)
        if (settings.temperature) setTemperature(settings.temperature)
        if (settings.maxTokens) setMaxTokens(settings.maxTokens)
      } catch (e) {
        console.error('Erro ao carregar configurações:', e)
      }
    }
  }, [])

  const handleSaveSettings = () => {
    // Salvar configurações no localStorage
    const settings = {
      name,
      email,
      language,
      theme,
      notifications,
      soundEffects,
      apiKey,
      model,
      temperature,
      maxTokens
    }
    
    localStorage.setItem('userSettings', JSON.stringify(settings))
    setSaveStatus('Configurações salvas com sucesso!')
    
    // Limpar mensagem de status após 3 segundos
    setTimeout(() => {
      setSaveStatus('')
    }, 3000)
  }
  
  const handleLogout = () => {
    // Remover token de autenticação
    localStorage.removeItem('authToken')
    // Redirecionar para a página de login
    router.push('/login')
  }

  return (
    <div className="flex h-screen bg-light-gray-bg">
      <ChatSidebar />

      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-border-gray bg-white px-6 py-4">
          <div className="flex items-center">
            <Link href="/chat" className="mr-4">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-text-primary">Configurações</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleLogout} variant="outline" className="flex items-center gap-1">
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
            <Button onClick={handleSaveSettings} className="bg-primary hover:bg-primary-hover">
              <Save className="h-4 w-4 mr-2" />
              Salvar alterações
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-4xl">
            {saveStatus && (
              <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md">
                {saveStatus}
              </div>
            )}
            <Tabs defaultValue="perfil" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="perfil">Perfil</TabsTrigger>
                <TabsTrigger value="aparencia">Aparência</TabsTrigger>
                <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
                <TabsTrigger value="integracao">Integração IA</TabsTrigger>
              </TabsList>

              <TabsContent value="perfil">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações do Perfil</CardTitle>
                    <CardDescription>Atualize suas informações pessoais e preferências.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Idioma</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Selecione um idioma" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                          <SelectItem value="en-US">English (US)</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="aparencia">
                <Card>
                  <CardHeader>
                    <CardTitle>Aparência</CardTitle>
                    <CardDescription>Personalize a aparência da interface.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="theme">Tema</Label>
                      <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger id="theme">
                          <SelectValue placeholder="Selecione um tema" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Claro</SelectItem>
                          <SelectItem value="dark">Escuro</SelectItem>
                          <SelectItem value="system">Sistema</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notificacoes">
                <Card>
                  <CardHeader>
                    <CardTitle>Notificações</CardTitle>
                    <CardDescription>Configure suas preferências de notificação.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notifications">Notificações</Label>
                      <Switch id="notifications" checked={notifications} onCheckedChange={setNotifications} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sound">Efeitos sonoros</Label>
                      <Switch id="sound" checked={soundEffects} onCheckedChange={setSoundEffects} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="integracao">
                <Card>
                  <CardHeader>
                    <CardTitle>Integração com IA</CardTitle>
                    <CardDescription>Configure a integração com modelos de IA.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="apiKey">Chave da API</Label>
                      <Input
                        id="apiKey"
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk-..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="model">Modelo</Label>
                      <Select value={model} onValueChange={setModel}>
                        <SelectTrigger id="model">
                          <SelectValue placeholder="Selecione um modelo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4">GPT-4</SelectItem>
                          <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                          <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="temperature">Temperatura</Label>
                        <Input
                          id="temperature"
                          type="number"
                          min="0"
                          max="2"
                          step="0.1"
                          value={temperature}
                          onChange={(e) => setTemperature(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="maxTokens">Máximo de tokens</Label>
                        <Input
                          id="maxTokens"
                          type="number"
                          min="1"
                          max="8192"
                          value={maxTokens}
                          onChange={(e) => setMaxTokens(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
