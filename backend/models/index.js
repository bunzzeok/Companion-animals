// 모든 모델을 한 곳에서 관리하는 인덱스 파일

// 모델들 불러오기
const User = require('./User');
const Pet = require('./Pet');
const Adoption = require('./Adoption');

// 데이터베이스 관련 유틸리티 함수들
const dbUtils = {
  // 모든 모델의 인덱스 생성 (개발 환경에서 사용)
  async createIndexes() {
    try {
      console.log('🔍 Creating database indexes...');
      
      await User.createIndexes();
      console.log('✅ User indexes created');
      
      await Pet.createIndexes();
      console.log('✅ Pet indexes created');
      
      await Adoption.createIndexes();
      console.log('✅ Adoption indexes created');
      
      console.log('🎉 All database indexes created successfully');
    } catch (error) {
      console.error('❌ Error creating indexes:', error);
      throw error;
    }
  },

  // 데이터베이스 연결 테스트
  async testConnection() {
    try {
      const mongoose = require('mongoose');
      
      if (mongoose.connection.readyState === 1) {
        console.log('✅ Database connection is active');
        return true;
      } else {
        console.log('❌ Database connection is not active');
        return false;
      }
    } catch (error) {
      console.error('❌ Database connection test failed:', error);
      return false;
    }
  },

  // 개발용 샘플 데이터 생성
  async createSampleData() {
    try {
      console.log('📝 Creating sample data...');
      
      // 관리자 계정 생성 (이미 존재하지 않는 경우)
      const adminExists = await User.findOne({ email: 'admin@companionanimals.com' });
      if (!adminExists) {
        const admin = new User({
          email: 'admin@companionanimals.com',
          password: 'admin123456',
          name: 'Admin User',
          phone: '010-0000-0000',
          userType: 'admin',
          isVerified: true,
          address: {
            city: 'Seoul',
            district: 'Gangnam-gu'
          }
        });
        await admin.save();
        console.log('✅ Admin user created');
      }

      // 샘플 분양자 계정
      const providerExists = await User.findOne({ email: 'provider@test.com' });
      if (!providerExists) {
        const provider = new User({
          email: 'provider@test.com',
          password: 'test123456',
          name: 'Test Provider',
          phone: '010-1111-1111',
          userType: 'provider',
          isVerified: true,
          address: {
            city: 'Seoul',
            district: 'Mapo-gu'
          },
          bio: 'I rescue and help stray cats find loving homes.'
        });
        await provider.save();
        console.log('✅ Sample provider created');
      }

      // 샘플 입양희망자 계정
      const adopterExists = await User.findOne({ email: 'adopter@test.com' });
      if (!adopterExists) {
        const adopter = new User({
          email: 'adopter@test.com',
          password: 'test123456',
          name: 'Test Adopter',
          phone: '010-2222-2222',
          userType: 'adopter',
          isVerified: true,
          address: {
            city: 'Seoul',
            district: 'Gangbuk-gu'
          },
          bio: 'Looking for a furry friend to complete our family.'
        });
        await adopter.save();
        console.log('✅ Sample adopter created');
      }

      console.log('🎉 Sample data creation completed');
    } catch (error) {
      console.error('❌ Error creating sample data:', error);
      throw error;
    }
  },

  // 데이터베이스 통계 조회
  async getDbStats() {
    try {
      const stats = {
        users: await User.countDocuments(),
        pets: await Pet.countDocuments(),
        adoptions: await Adoption.countDocuments(),
        usersByType: await User.aggregate([
          { $group: { _id: '$userType', count: { $sum: 1 } } }
        ]),
        petsByStatus: await Pet.aggregate([
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ]),
        adoptionsByStatus: await Adoption.aggregate([
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ])
      };
      
      return stats;
    } catch (error) {
      console.error('❌ Error getting database stats:', error);
      throw error;
    }
  },

  // 데이터베이스 정리 (개발/테스트용)
  async clearDatabase() {
    try {
      console.log('🧹 Clearing database...');
      
      await User.deleteMany({});
      console.log('✅ Users cleared');
      
      await Pet.deleteMany({});
      console.log('✅ Pets cleared');
      
      await Adoption.deleteMany({});
      console.log('✅ Adoptions cleared');
      
      console.log('🎉 Database cleared successfully');
    } catch (error) {
      console.error('❌ Error clearing database:', error);
      throw error;
    }
  }
};

// 모델들과 유틸리티 함수들 내보내기
module.exports = {
  User,
  Pet,
  Adoption,
  dbUtils
};

// 개별 모델들도 내보내기 (편의성을 위해)
module.exports.User = User;
module.exports.Pet = Pet;
module.exports.Adoption = Adoption;
module.exports.dbUtils = dbUtils;