import { useContext, useState } from "react";
import { User, KeyRound, ShieldCheck } from "lucide-react";
import { AuthContext } from "../../../context/AuthContext";
import { Card, Badge } from "../../../components/ui";
import { Loading } from "../../../components/common"; 
import ProfileForm from "../components/ProfileForm";
import ChangePasswordForm from "../components/ChangePasswordForm";
import { useToast } from "../../toast/useToast"; 
import { userApi } from "../services/userApi";

function UserProfilePage() {
  const { user, setUser } = useContext(AuthContext); 
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const toast = useToast(); 

  const handleUpdateProfile = async (formData) => {
    setIsUpdatingProfile(true);
    try {
      const response = await userApi.updateProfile(formData);
      
      if (setUser && response.data) {
        setUser(response.data);
      }
      
      toast.success("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Đã xảy ra lỗi khi cập nhật thông tin.";
      toast.error(errorMsg);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (formData) => {
    setIsChangingPassword(true);
    try {
      await userApi.changePassword(formData);
      toast.success("Đổi mật khẩu thành công!");
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Mật khẩu hiện tại không đúng hoặc có lỗi máy chủ!";
      toast.error(errorMsg);
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (user === undefined) {
      return <Loading text="Đang tải dữ liệu hồ sơ..." fullScreen />;
  }

  if (user === null) {
      return null; 
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Hồ sơ cá nhân</h1>
        <p className="text-slate-500 mt-2">Quản lý thông tin tài khoản và bảo mật.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-1">
          <Card className="p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-4xl mb-4 shadow-sm border-4 border-white ring-2 ring-slate-100 overflow-hidden">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={40} />
              )}
            </div>
            
            <h2 className="text-xl font-bold text-slate-800">{user.name || user.fullName || "User"}</h2>
            <p className="text-sm text-slate-500 mb-3">{user.email}</p>
            
            <Badge variant="info" className="gap-1 px-3 py-1 shadow-sm">
              <ShieldCheck size={14} /> 
              {user.role === 'READER' ? 'Độc giả' : user.role}
            </Badge>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          
          <Card className="p-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-2">
              <User className="text-blue-600" size={20} />
              <h3 className="text-lg font-bold text-slate-800">Thông tin chung</h3>
            </div>
            <ProfileForm 
              initialData={user} 
              onSubmit={handleUpdateProfile} 
              isLoading={isUpdatingProfile} 
            />
          </Card>

          <Card className="p-6 border-red-100/50">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-2">
              <KeyRound className="text-red-500" size={20} />
              <h3 className="text-lg font-bold text-slate-800">Bảo mật</h3>
            </div>
            <ChangePasswordForm 
              onSubmit={handleChangePassword} 
              isLoading={isChangingPassword} 
            />
          </Card>

        </div>
      </div>
    </div>
  );
}

export default UserProfilePage;