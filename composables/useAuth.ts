import { auth, provider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "~/plugins/firebase";
import type { User } from "firebase/auth";
import { useRouter } from 'vue-router';

export const useAuth = () => {
    const user = useState<User | null>("user", () => null);
    const router = useRouter();

    const login = async (): Promise<User | void> => {
        try {
            const result = await signInWithPopup(auth, provider);
            user.value = result.user;
            router.push('/home');
            return result.user;
        } catch (error) {
            console.error("Error al autenticar:", error);
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await signOut(auth);
            user.value = null;
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    const registerWithEmail = async (email: string, password: string, username: string): Promise<User | void> => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(result.user, { displayName: username });
            user.value = result.user;
            return result.user;
        } catch (error) {
            console.error("Error al registrar:", error);
        }
    };

    const loginWithEmail = async (email: string, password: string): Promise<User | void> => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            user.value = result.user;
            router.push('/home');
            return result.user;
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
        }
    };

    // Función para obtener el token del usuario autenticado
    const getToken = async (): Promise<string | null> => {
        if (!user.value) return null;
        return await user.value.getIdToken();
    };

    // Ejemplo de función que obtiene datos protegidos usando el token
    const fetchProtectedData = async (): Promise<any> => {
        const token = await getToken();
        if (!token) return;

        const response = await fetch("http://localhost:7000/protected", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.json();
    };

    return { user, login, logout, fetchProtectedData, registerWithEmail, loginWithEmail };
};
