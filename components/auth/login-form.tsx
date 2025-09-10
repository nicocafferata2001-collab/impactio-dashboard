const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  setError("")

  try {
    const supabase = createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Error en login:", error) // 👈 para debug
      setError(error.message)
    } else {
      console.log("Login OK:", data) // 👈 para debug
      window.location.href = "/dashboard"
    }
  } catch (err: any) {
    console.error("Excepción en login:", err)
    setError("Hubo un error inesperado al intentar iniciar sesión.")
  }

  setLoading(false)
}
